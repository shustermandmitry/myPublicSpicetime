import { MetaType, metaType } from '@treenity/core';
import ts from 'typescript';
import { JsonSchemaGenerator } from 'typescript-json-schema';

export interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  decorators?: DocEntry[];
  returnType?: string;
  metaType?: MetaType<any>;
  methods?: MethodEntry[];
}

interface MethodEntry {
  name: string;
  parameters: ParameterEntry[];
  returnType: string;
  documentation?: string;
}

interface ParameterEntry {
  name: string;
  type: string;
  documentation?: string;
}

const UNWRAP_TYPES = ['Partial', 'Promise'];

/** Generate documention for all classes in a set of .ts files */
export function getEntityDecorators(
  program: ts.Program,
  generator: JsonSchemaGenerator,
): DocEntry[] {
  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const output: DocEntry[] = [];
  const metaTypes: Record<string, MetaType<any>> = {};

  function getSourceFileName(typeNode: ts.Identifier): string {
    let baseClassSymbol = checker.getSymbolAtLocation(typeNode)!;
    if (ts.SymbolFlags.Alias & baseClassSymbol.flags)
      baseClassSymbol = checker.getAliasedSymbol(baseClassSymbol)!;
    return baseClassSymbol.declarations?.[0].getSourceFile().fileName || '';
  }

  // Visit every sourceFile in the program
  const sourceFiles = program.getSourceFiles();
  for (const sourceFile of sourceFiles) {
    ts.forEachChild(sourceFile, visitMetaType);

    // Walk the tree to search for classes
    ts.forEachChild(sourceFile, visit);
  }

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      // This is a top level class, get its symbol

      output.push(serializeClass(<ts.ClassDeclaration>node));
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol, node?: ts.Node): DocEntry {
    const anyNode = node as any;
    return {
      name: symbol.getName() === 'default' && anyNode?.name ? anyNode.name.text : symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
      ),
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(node: ts.ClassDeclaration) {
    let symbol = checker.getSymbolAtLocation(node.name!)!;

    let details = serializeSymbol(symbol, node);
    // Get the construct signatures
    details.decorators =
      (node.modifiers?.filter(m => m?.kind === ts.SyntaxKind.Decorator) as ts.Decorator[])?.map(
        serializeDecorator,
      ) ?? [];
    // return early for classes without decorators
    if (details.decorators.length === 0) return details;

    let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
    details.fileName = (node.parent as any).fileName;

    // Add method extraction with JSON Schema format
    const methodEntries = node.members
      .filter(ts.isMethodDeclaration)
      .filter(method => {
        return (
          ts
            .getDecorators(method)
            ?.some(
              d => d.expression.getText() === 'method' || d.expression.getText() === 'writeMethod',
            ) ?? false
        );
      })
      .map(method => {
        const methodSymbol = checker.getSymbolAtLocation(method.name)!;
        const signature = checker.getSignatureFromDeclaration(method)!;

        return [
          methodSymbol.getName(),
          {
            description:
              ts.displayPartsToString(methodSymbol.getDocumentationComment(checker)) || undefined,
            arguments: signature.parameters.map(param => ({
              name: param.getName(),
              description:
                ts.displayPartsToString(param.getDocumentationComment(checker)) || undefined,
              ...convertTypeToJsonSchema(
                checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration!),
              ),
            })),
            return: convertTypeToJsonSchema(signature.getReturnType()),
          },
        ];
      });
    (details as any).methods = Object.fromEntries(methodEntries);

    return details;
  }

  function serializeDecorator(decorator: ts.Decorator) {
    let symbol = checker.getSymbolAtLocation(decorator.expression.getFirstToken()!)!;
    let decoratorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    let details = serializeSymbol(symbol);
    details.constructors = decoratorType.getCallSignatures().map(serializeSignature);
    const className = (decorator.parent as ts.ClassDeclaration).name?.getText();

    if (ts.isCallExpression(decorator.expression)) {
      const param = decorator.expression.arguments[0];
      // let symbol = checker.getSymbolAtLocation(decorator.expression.expression!)!;
      const typeName = param.getText();

      details.metaType = getMetaType(decorator).type;
      // if (ts.isStringLiteralLike(param)) {
      //   details.metaType = metaTypes[decorator.getSourceFile().fileName + ':' + className];
      // } else {
      //   // check context not changed
      //   const inContextMatch =
      //     typeName.match(/(\w+)\.inContext\('([\w.]+)'\)/) || typeName.match(/^(\w+)\.(\w+)$/);
      //   if (inContextMatch) {
      //     details.metaType = metaTypes[inContextMatch[1]]?.inContext(inContextMatch[2]);
      //   } else {
      //     details.metaType = metaTypes[param.getSourceFile().fileName + ':' + typeName];
      //   }
      // }
    }

    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(p => serializeSymbol(p)),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (node.flags & ts.NodeFlags.ExportContext) !== 0 ||
      (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

  function extractInContext(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      if (ts.isPropertyAccessExpression(expression) && expression.name.text === 'inContext') {
        const object = expression.expression;
        if (ts.isIdentifier(object)) {
          const baseType = metaTypes[getSourceFileName(object) + ':' + object.text];
          const context = (node as any).arguments[0].text;

          if (!context) {
            throw new Error(`wrong usage of 'inContext'`);
          }
          return baseType.inContext(context);
        }
      }
    }
  }

  function extractVariableInContext(node: ts.Node) {
    // Matches: const NewType = BaseType.inContext('some.context')
    // or: const NewType = BaseType.inContext('context')
    if (ts.isVariableDeclaration(node.parent)) {
      const type = extractInContext(node);
      if (type) {
        const name = node.parent.name.getText();
        const fileName = node.getSourceFile().fileName;
        return { name: fileName + ':' + name, type };
      }
    }
  }

  function getMetaType(node: ts.Node): { name?: string; type?: MetaType<any> } {
    const fileName = node.getSourceFile().fileName;

    // Matches: export const MyType = metaType("type1", "type2")
    // or: const MyType = metaType("type1", "type2")
    if (
      ts.isCallExpression(node) &&
      ts.isVariableDeclaration(node.parent) &&
      node.expression.getText() === 'metaType' &&
      node.arguments[0].kind === ts.SyntaxKind.StringLiteral
    ) {
      const variableDeclaration = node.parent;
      const isExported = ts.getCombinedModifierFlags(variableDeclaration) & ts.ModifierFlags.Export;

      if (!isExported) {
        console.warn(
          variableDeclaration.name.getText(),
          'should be exported to generate schema in',
          variableDeclaration.getSourceFile().fileName,
        );
      }

      const parameters = node.arguments;
      const variableName = variableDeclaration.name.getText();

      const params = parameters.map(p => {
        return (p as ts.StringLiteral).text;
      });

      return { name: fileName + ':' + variableName, type: metaType(params[0], params[1]) };
    }

    const inContext = extractVariableInContext(node);
    if (inContext) return inContext;

    // Matches: @entity('type1', 'type2') or @entity(BaseClass, 'context')
    if (ts.isDecorator(node) && ts.isClassDeclaration(node.parent)) {
      const expr = node.expression;
      if (ts.isCallExpression(expr) && expr.expression.getText() === 'entity') {
        const className = node.parent.name?.getText();
        const args = expr.arguments;

        if (args.length >= 1) {
          const [typeNode, contextNode] = args;
          const typeInContext = extractInContext(typeNode);
          if (typeInContext) {
            return {
              name: fileName + ':' + className,
              type: typeInContext,
            };
          }

          if (ts.isStringLiteral(typeNode)) {
            // Case: @entity('type1', 'context')
            const type1 = typeNode.text;
            // Handle case where there's only one argument
            const context =
              args.length > 1 && ts.isStringLiteral(contextNode) ? contextNode.text : '';
            return { name: fileName + ':' + className, type: metaType(type1, context) };
          } else if (ts.isIdentifier(typeNode)) {
            const baseClass = getSourceFileName(typeNode) + ':' + typeNode.getText();
            if (!metaTypes[baseClass]) {
              throw new Error(
                `@entity decorator wrong usage, use: @entity(MyEntity|'my-entity', 'ctx') in ${fileName}`,
              );
            }
            const context = contextNode && ts.isStringLiteral(contextNode) ? contextNode.text : '';

            return {
              name: fileName + ':' + className,
              type: metaTypes[baseClass].inContext(context),
            };
            // }
          } else {
            throw new Error(
              `@entity decorator wrong usage, use: @entity(MyEntity|'my-entity', 'ctx') in ${fileName}`,
            );
            // Case: @entity(BaseClass, 'context')
            // const baseClass = typeNode.getText();
            // const context = (contextNode && ts.isStringLiteral(contextNode)) ? contextNode.text : '';
            // if (metaTypes[baseClass]) {
            //   return { name: fileName + ':' + className, type: metaTypes[baseClass].inContext(context) };
            // }
          }
        }
      }
    }

    return {};
  }

  function visitMetaType(node: ts.Node) {
    // Check if the node is a call expression
    const { name, type } = getMetaType(node);

    if (name) metaTypes[name] = type!;
    // Continue traversing the child nodes
    ts.forEachChild(node, visitMetaType);
  }

  function convertTypeToJsonSchema(type: ts.Type, options?: any): any {
    const schema = _convertTypeToJsonSchema(type);
    if (options) {
      return Object.assign(schema, options);
    }
    return schema;
  }

  function _convertTypeToJsonSchema(type: ts.Type): any {
    // if (type.flags & ts.TypeFlags.NumberLike) {
    //   return { type: 'number' };
    // }
    // if (type.flags & ts.TypeFlags.StringLike) {
    //   return { type: 'string' };
    // }
    // if (type.flags & ts.TypeFlags.BooleanLike) {
    //   return { type: 'boolean' };
    // }
    if (type.flags & ts.TypeFlags.VoidLike) {
      return { type: 'undefined' };
    }
    // if (type.flags & ts.TypeFlags.Any || type.flags & ts.TypeFlags.Unknown) {
    //   return {};
    // }
    // if (type.isUnion()) {
    //   if (type.types.length === 2 && type.types[0].flags & ts.TypeFlags.Undefined) { // maybe optional
    //     return convertTypeToJsonSchema(type.types[1], { optional: true });
    //   }
    //   return {
    //     anyOf: type.types.map(t => convertTypeToJsonSchema(t)),
    //   };
    // }
    // if (type.isIntersection()) {
    //   return {
    //     allOf: type.types.map(t => convertTypeToJsonSchema(t)),
    //   };
    // }
    // if (checker.isArrayType(type)) {
    //   return {
    //     type: 'array',
    //     items: convertTypeToJsonSchema(checker.getTypeArguments(type as ts.TypeReference)[0]),
    //   };
    // }
    // Add more type conversions as needed

    if (type.flags & ts.TypeFlags.BigInt) {
      return { type: 'integer', format: 'int64' };
    }

    if (type.flags & ts.TypeFlags.Object) {
      if (UNWRAP_TYPES.includes(type.aliasSymbol?.name!)) {
        return convertTypeToJsonSchema(type.aliasTypeArguments![0]);
      }
      if (UNWRAP_TYPES.includes(type.symbol?.name)) {
        return convertTypeToJsonSchema((type as any).typeArguments![0]);
      }
      const symbol = type.getSymbol();
      if (symbol) {
        const name = symbol.getName();
        const declaration = symbol.getDeclarations()?.[0];
        if (declaration) {
          const sourceFile = declaration.getSourceFile();
          const fileName = sourceFile.fileName;
          const metaTypeName = `${fileName}:${name}`;
          const metaType = metaTypes[metaTypeName];
          if (metaType) {
            return {
              type: 'object',
              $ref: `${metaType.$id}`,
            };
          }
        }
      }
    }
    const def = (generator as any).getTypeDefinition(type);
    return def;
  }

  const result = output.filter(o => o.decorators?.length);
  return result;
}
