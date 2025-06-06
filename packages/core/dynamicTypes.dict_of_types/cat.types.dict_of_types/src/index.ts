/**
 * @fileoverview Cat Types Dictionary - Simple categorical types
 *
 * Categorical types built with base type composition.
 * Exports simple namespace for t.cat integration.
 */

// Main cat types API
export { cat } from './core/cat-types.js';

// Individual type exports
export {
  subject,
  morphism,
  category,
  functor,
  naturalTransformation,
  dictionary,
  classification
} from './core/cat-types.js';

// Error classes
export {
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
} from './errors.js';

// Default export
export { cat as default } from './core/cat-types.js';
