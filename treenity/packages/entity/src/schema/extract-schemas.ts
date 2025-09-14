#!/usr/bin/env tsx

import fs from 'node:fs/promises';
import * as path from 'path';
// import { stringify } from 'safe-stable-stringify';
import * as ts from 'typescript';
import {
  buildGenerator,
  generateSchema,
  getDefaultArgs,
  JsonSchemaGenerator,
  programFromConfig,
} from 'typescript-json-schema';
import { getEntityDecorators } from './get-entity-decorators';

export type { Program, CompilerOptions, Symbol } from 'typescript';

const EXTENDED_FIELD_KEYWORDS = ['widget', 'form.input', 'form.label', 'format'];

async function writeToFile(fileName: string, json: string): Promise<void> {
  await fs.mkdir(path.dirname(fileName), { recursive: true });
  await fs.writeFile(fileName, json);
}

export async function exec(
  // filePattern: string,
  args = getDefaultArgs(),
): Promise<void> {
  let onlyIncludeFiles: string[] | undefined = undefined;
  let program: ts.Program = programFromConfig('tsconfig.json', onlyIncludeFiles);
  const packageJson = JSON.parse((await fs.readFile('package.json')).toString());

  args.required = true;
  args.validationKeywords = EXTENDED_FIELD_KEYWORDS;
  args.excludePrivate = true;
  args.ignoreErrors = true;

  function makeGenerator(): JsonSchemaGenerator {
    const generator = buildGenerator(program, args, onlyIncludeFiles);

    if (generator === null) {
      throw new Error('No output definition. Probably caused by errors prior to this?');
    }

    // override some methods to be correct
    const genAny: any = generator;

    const parseCommentsIntoDefinition = genAny.parseCommentsIntoDefinition;
    genAny.parseCommentsIntoDefinition = function (prop: any, defs: any, other: any) {
      const name = prop?.getName();
      if (name) {
        // exclude _field, $field, #field, but not __field
        if ((name[0] === '_' && name[1] !== '_') || name[0] === '#' || name[0] === '$')
          defs.ignore = true;
      }
      return parseCommentsIntoDefinition.call(this, prop, defs, other);
    };
    const getDefinitionForProperty = genAny.getDefinitionForProperty;
    genAny.getDefinitionForProperty = function (prop: ts.Symbol, node: ts.Node) {
      const defenition = getDefinitionForProperty.call(this, prop, node);
      if (defenition) this.parseCommentsIntoDefinition(prop, defenition, {});

      return defenition;
    };

    return generator;
  }

  const generator = makeGenerator();

  const types = getEntityDecorators(program, generator);

  for (let typeInfo of types) {
    const decorator = typeInfo.decorators?.find(d => d.name === 'entity');
    if (!decorator?.metaType) continue;

    const fileName = path.relative(process.cwd(), typeInfo.fileName!);
    (generator as any).args.id = packageJson.name + ':' + decorator.metaType.$id;
    args.out = fileName.slice(0, fileName.lastIndexOf('.')) + '.schema.json'; // change extension to json

    console.log('Generating schema for', typeInfo.name, args.id, args.out);

    const definition = generateSchema(program, typeInfo.name!, args, onlyIncludeFiles, generator)!;

    // Add methods information to the schema
    if (typeInfo.methods && Object.keys(typeInfo.methods).length > 0) {
      (definition as any).methods = typeInfo.methods;
    }

    const json = JSON.stringify(sortSchemaFields(definition), null, 4) + '\n\n';

    await writeToFile(args.out, json);
  }
}

function sortSchemaFields(obj: any) {
  const result: any = {};

  // sort $ fields first and then all other fields in original order
  Object.keys(obj)
    .sort((l, r) => (l[0] === '$' || r[0] === '$' ? l.localeCompare(r) : 0))
    .forEach(k => (result[k] = obj[k]));

  return result;
}
