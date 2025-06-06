/**
 * @fileoverview Error Classes Tests
 * 
 * Tests the custom error classes that derive from STError.
 */

import { describe, it, expect } from 'vitest';
import {
  CategoryTypeError,
  CategoryNotFoundError,
  DuplicateCategoryError,
  CategoryValidationError,
  TypeClassificationError,
  CategoryHierarchyError,
  DictionaryOperationError,
  TypeMappingError,
  CategoryConfigurationError,
  RegistryError,
  CategorySerializationError
} from '../errors.js';

describe('Error Classes', () => {
  describe('CategoryTypeError (Base Error)', () => {
    it('should create base category type error', () => {
      const error = new CategoryTypeError('Test error message');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategoryTypeError');
      expect(error.message).toBe('Test error message');
    });

    it('should support error chaining with cause', () => {
      const cause = new Error('Original error');
      const error = new CategoryTypeError('Wrapped error', cause);
      
      expect(error.cause).toBe(cause);
      expect(error.message).toBe('Wrapped error');
    });

    it('should maintain proper error stack', () => {
      const error = new CategoryTypeError('Stack test');
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('CategoryTypeError');
    });
  });

  describe('CategoryNotFoundError', () => {
    it('should create category not found error with category ID', () => {
      const error = new CategoryNotFoundError('user-types');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategoryNotFoundError');
      expect(error.message).toBe('Category not found: user-types');
      expect(error.categoryId).toBe('user-types');
    });

    it('should support error chaining', () => {
      const cause = new Error('Database connection failed');
      const error = new CategoryNotFoundError('user-types', cause);
      
      expect(error.cause).toBe(cause);
      expect(error.categoryId).toBe('user-types');
    });
  });

  describe('DuplicateCategoryError', () => {
    it('should create duplicate category error with category ID', () => {
      const error = new DuplicateCategoryError('user-types');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('DuplicateCategoryError');
      expect(error.message).toBe('Category already exists: user-types');
      expect(error.categoryId).toBe('user-types');
    });
  });

  describe('CategoryValidationError', () => {
    it('should create validation error with multiple validation errors', () => {
      const validationErrors = [
        'Name is required',
        'ID must be unique',
        'Properties must be an object'
      ];
      const error = new CategoryValidationError(validationErrors);
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategoryValidationError');
      expect(error.message).toBe('Category validation failed: Name is required, ID must be unique, Properties must be an object');
      expect(error.validationErrors).toEqual(validationErrors);
    });

    it('should handle single validation error', () => {
      const error = new CategoryValidationError(['Invalid category name']);
      
      expect(error.validationErrors).toEqual(['Invalid category name']);
      expect(error.message).toContain('Invalid category name');
    });
  });

  describe('TypeClassificationError', () => {
    it('should create type classification error with type and reason', () => {
      const error = new TypeClassificationError('UserType', 'Missing required properties');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('TypeClassificationError');
      expect(error.message).toBe('Failed to classify type \'UserType\': Missing required properties');
      expect(error.typeName).toBe('UserType');
      expect(error.reason).toBe('Missing required properties');
    });
  });

  describe('CategoryHierarchyError', () => {
    it('should create hierarchy error with operation and path', () => {
      const categoryPath = ['root', 'types', 'user', 'profile'];
      const error = new CategoryHierarchyError('traverse', categoryPath, 'Circular reference detected');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategoryHierarchyError');
      expect(error.message).toBe('Category hierarchy traverse failed at path [root -> types -> user -> profile]: Circular reference detected');
      expect(error.operation).toBe('traverse');
      expect(error.categoryPath).toEqual(categoryPath);
    });

    it('should handle empty category path', () => {
      const error = new CategoryHierarchyError('create', [], 'Root category missing');
      
      expect(error.message).toContain('path []');
      expect(error.categoryPath).toEqual([]);
    });
  });

  describe('DictionaryOperationError', () => {
    it('should create dictionary operation error', () => {
      const error = new DictionaryOperationError('insert', 'user-dict', 'Key already exists');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('DictionaryOperationError');
      expect(error.message).toBe('Dictionary operation \'insert\' failed for dictionary \'user-dict\': Key already exists');
      expect(error.operation).toBe('insert');
      expect(error.dictionaryId).toBe('user-dict');
    });
  });

  describe('TypeMappingError', () => {
    it('should create type mapping error', () => {
      const error = new TypeMappingError('UserProfile', 'user-types', 'Type structure mismatch');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('TypeMappingError');
      expect(error.message).toBe('Failed to map type \'UserProfile\' to category \'user-types\': Type structure mismatch');
      expect(error.sourceType).toBe('UserProfile');
      expect(error.targetCategory).toBe('user-types');
    });
  });

  describe('CategoryConfigurationError', () => {
    it('should create configuration error with path and value', () => {
      const configValue = { invalid: true };
      const error = new CategoryConfigurationError('validation.rules', configValue, 'Invalid rule format');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategoryConfigurationError');
      expect(error.message).toBe('Invalid category configuration at \'validation.rules\': Invalid rule format');
      expect(error.configPath).toBe('validation.rules');
      expect(error.configValue).toEqual(configValue);
    });
  });

  describe('RegistryError', () => {
    it('should create registry error with operation and state', () => {
      const error = new RegistryError('register', 'locked', 'Registry is in read-only mode');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('RegistryError');
      expect(error.message).toBe('Registry operation \'register\' failed in state \'locked\': Registry is in read-only mode');
      expect(error.registryOperation).toBe('register');
      expect(error.registryState).toBe('locked');
    });
  });

  describe('CategorySerializationError', () => {
    it('should create serialization error', () => {
      const error = new CategorySerializationError('serialize', 'JSON', 'Circular reference detected');
      
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error.name).toBe('CategorySerializationError');
      expect(error.message).toBe('Category serialize failed for format \'JSON\': Circular reference detected');
      expect(error.operation).toBe('serialize');
      expect(error.format).toBe('JSON');
    });

    it('should create deserialization error', () => {
      const error = new CategorySerializationError('deserialize', 'XML', 'Invalid XML structure');
      
      expect(error.operation).toBe('deserialize');
      expect(error.format).toBe('XML');
      expect(error.message).toContain('deserialize');
    });
  });

  describe('Error Inheritance and STError Integration', () => {
    it('should maintain proper inheritance chain', () => {
      const error = new CategoryNotFoundError('test');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CategoryTypeError);
      expect(error).toBeInstanceOf(CategoryNotFoundError);
    });

    it('should support instanceof checks for all error types', () => {
      const errors = [
        new CategoryTypeError('base'),
        new CategoryNotFoundError('id'),
        new DuplicateCategoryError('id'),
        new CategoryValidationError(['error']),
        new TypeClassificationError('type', 'reason'),
        new CategoryHierarchyError('op', [], 'reason'),
        new DictionaryOperationError('op', 'dict', 'reason'),
        new TypeMappingError('type', 'cat', 'reason'),
        new CategoryConfigurationError('path', {}, 'reason'),
        new RegistryError('op', 'state', 'reason'),
        new CategorySerializationError('serialize', 'JSON', 'reason')
      ];
      
      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(CategoryTypeError);
      });
    });

    it('should preserve error properties through inheritance', () => {
      const cause = new Error('Original');
      const error = new TypeClassificationError('TestType', 'Test reason', cause);
      
      expect(error.cause).toBe(cause);
      expect(error.typeName).toBe('TestType');
      expect(error.reason).toBe('Test reason');
      expect(error.name).toBe('TypeClassificationError');
      expect(error.message).toContain('TestType');
      expect(error.message).toContain('Test reason');
    });

    it('should support error serialization for logging', () => {
      const error = new CategoryHierarchyError('traverse', ['a', 'b', 'c'], 'Test error');
      
      const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error));
      const parsed = JSON.parse(serialized);
      
      expect(parsed.name).toBe('CategoryHierarchyError');
      expect(parsed.message).toContain('traverse');
      expect(parsed.operation).toBe('traverse');
      expect(parsed.categoryPath).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Error Context and Debugging', () => {
    it('should provide meaningful error messages for debugging', () => {
      const error = new CategoryHierarchyError(
        'insert', 
        ['root', 'types', 'user'], 
        'Maximum depth exceeded'
      );
      
      expect(error.message).toContain('insert');
      expect(error.message).toContain('root -> types -> user');
      expect(error.message).toContain('Maximum depth exceeded');
    });

    it('should support error context for complex operations', () => {
      const validationErrors = [
        'Name must be at least 3 characters',
        'ID must be alphanumeric',
        'Properties cannot be empty'
      ];
      const error = new CategoryValidationError(validationErrors);
      
      expect(error.validationErrors).toHaveLength(3);
      expect(error.message).toContain('Name must be at least 3 characters');
      expect(error.message).toContain('ID must be alphanumeric');
      expect(error.message).toContain('Properties cannot be empty');
    });

    it('should maintain error traceability through cause chain', () => {
      const rootCause = new Error('Database connection lost');
      const intermediateCause = new CategoryTypeError('Failed to load category', rootCause);
      const finalError = new CategoryNotFoundError('user-profile', intermediateCause);
      
      expect(finalError.cause).toBe(intermediateCause);
      expect(finalError.cause?.cause).toBe(rootCause);
      expect(finalError.categoryId).toBe('user-profile');
    });
  });
});
