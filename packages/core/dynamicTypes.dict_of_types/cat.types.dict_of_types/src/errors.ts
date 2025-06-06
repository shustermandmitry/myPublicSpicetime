/**
 * @fileoverview Custom Error Classes for Category Types Dictionary
 *
 * All custom errors derive from the core STError package as dependencies.
 */

import { STError } from '../../../error/index.js';

/**
 * Base error for all category type operations
 */
export class CategoryTypeError extends STError {
  constructor(message: string, extInfo?: unknown) {
    super(message, extInfo);
  }
}

/**
 * Error thrown when a category is not found
 */
export class CategoryNotFoundError extends CategoryTypeError {
  public readonly categoryId: string;

  constructor(categoryId: string, cause?: Error) {
    super(`Category not found: ${categoryId}`, cause);
    this.categoryId = categoryId;
  }
}

/**
 * Error thrown when attempting to register a duplicate category
 */
export class DuplicateCategoryError extends CategoryTypeError {
  public readonly categoryId: string;

  constructor(categoryId: string, cause?: Error) {
    super(`Category already exists: ${categoryId}`, cause);
    this.categoryId = categoryId;
  }
}

/**
 * Error thrown when category validation fails
 */
export class CategoryValidationError extends CategoryTypeError {
  public readonly validationErrors: string[];

  constructor(validationErrors: string[], cause?: Error) {
    super(`Category validation failed: ${validationErrors.join(', ')}`, cause);
    this.validationErrors = validationErrors;
  }
}

/**
 * Error thrown when type classification fails
 */
export class TypeClassificationError extends CategoryTypeError {
  public readonly typeName: string;
  public readonly reason: string;

  constructor(typeName: string, reason: string, cause?: Error) {
    super(`Failed to classify type '${typeName}': ${reason}`, cause);
    this.typeName = typeName;
    this.reason = reason;
  }
}

/**
 * Error thrown when category hierarchy operations fail
 */
export class CategoryHierarchyError extends CategoryTypeError {
  public readonly operation: string;
  public readonly categoryPath: string[];

  constructor(operation: string, categoryPath: string[], reason: string, cause?: Error) {
    super(`Category hierarchy ${operation} failed at path [${categoryPath.join(' -> ')}]: ${reason}`, cause);
    this.operation = operation;
    this.categoryPath = categoryPath;
  }
}

/**
 * Error thrown when dictionary operations fail
 */
export class DictionaryOperationError extends CategoryTypeError {
  public readonly operation: string;
  public readonly dictionaryId: string;

  constructor(operation: string, dictionaryId: string, reason: string, cause?: Error) {
    super(`Dictionary operation '${operation}' failed for dictionary '${dictionaryId}': ${reason}`, cause);
    this.operation = operation;
    this.dictionaryId = dictionaryId;
  }
}

/**
 * Error thrown when type mapping operations fail
 */
export class TypeMappingError extends CategoryTypeError {
  public readonly sourceType: string;
  public readonly targetCategory: string;

  constructor(sourceType: string, targetCategory: string, reason: string, cause?: Error) {
    super(`Failed to map type '${sourceType}' to category '${targetCategory}': ${reason}`, cause);
    this.sourceType = sourceType;
    this.targetCategory = targetCategory;
  }
}

/**
 * Error thrown when category configuration is invalid
 */
export class CategoryConfigurationError extends CategoryTypeError {
  public readonly configPath: string;
  public readonly configValue: unknown;

  constructor(configPath: string, configValue: unknown, reason: string, cause?: Error) {
    super(`Invalid category configuration at '${configPath}': ${reason}`, cause);
    this.configPath = configPath;
    this.configValue = configValue;
  }
}

/**
 * Error thrown when category registry operations fail
 */
export class RegistryError extends CategoryTypeError {
  public readonly registryOperation: string;
  public readonly registryState: string;

  constructor(operation: string, state: string, reason: string, cause?: Error) {
    super(`Registry operation '${operation}' failed in state '${state}': ${reason}`, cause);
    this.registryOperation = operation;
    this.registryState = state;
  }
}

/**
 * Error thrown when category serialization/deserialization fails
 */
export class CategorySerializationError extends CategoryTypeError {
  public readonly operation: 'serialize' | 'deserialize';
  public readonly format: string;

  constructor(operation: 'serialize' | 'deserialize', format: string, reason: string, cause?: Error) {
    super(`Category ${operation} failed for format '${format}': ${reason}`, cause);
    this.operation = operation;
    this.format = format;
  }
}
