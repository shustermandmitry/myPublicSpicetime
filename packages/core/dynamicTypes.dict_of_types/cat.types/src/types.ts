/**
 * @fileoverview Cat Types - CLEAR Type Definitions
 *
 * Every type is explicitly defined with clear documentation.
 * No obfuscation, no mystery types, everything spelled out.
 */

/**
 * Subject - Basic entity with categorical identity laws
 *
 * CLEAR STRUCTURE:
 * - id: string (unique identifier, must be lowercase, no spaces)
 * - name: string (human readable name, can be anything)
 *
 * LAWS ENFORCED:
 * - id ≠ name (identity law)
 * - id must be lowercase
 * - id cannot contain spaces
 */
export interface Subject {
  /** Unique identifier - must be lowercase, no spaces, different from name */
  id: string;
  /** Human readable name - can be any string */
  name: string;
}

/**
 * Morphism - Transformation between subjects with composition laws
 *
 * CLEAR STRUCTURE:
 * - id: string (unique identifier for this transformation)
 * - source: string (subject id this morphism starts from)
 * - target: string (subject id this morphism goes to)
 *
 * LAWS ENFORCED:
 * - Composition law: non-identity morphisms must have different source/target
 * - Identity law: identity morphisms (id starts with 'id_') must have same source/target
 * - Uniqueness law: morphism id must be different from source and target
 */
export interface Morphism {
  /** Unique identifier for this transformation */
  id: string;
  /** Subject id this morphism starts from */
  source: string;
  /** Subject id this morphism goes to */
  target: string;
}

/**
 * Category - Collection of subjects with categorical structure laws
 *
 * CLEAR STRUCTURE:
 * - id: string (unique identifier for this category)
 * - name: string (human readable name)
 * - subjects: string[] (array of subject ids in this category)
 *
 * LAWS ENFORCED:
 * - Structure law: category cannot contain itself as a subject
 * - Hierarchy law: category id must be different from name
 * - Uniqueness law: no duplicate subjects in the array
 */
export interface Category {
  /** Unique identifier for this category */
  id: string;
  /** Human readable name */
  name: string;
  /** Array of subject ids that belong to this category */
  subjects: string[];
}

/**
 * Functor - Mapping between categories with structure preservation laws
 *
 * CLEAR STRUCTURE:
 * - id: string (unique identifier for this functor)
 * - sourceCategory: string (category id this functor maps from)
 * - targetCategory: string (category id this functor maps to)
 *
 * LAWS ENFORCED:
 * - Functor law: non-identity functors must map between different categories
 * - Identity functors (id starts with 'id_') can map category to itself
 */
export interface Functor {
  /** Unique identifier for this functor */
  id: string;
  /** Category id this functor maps from */
  sourceCategory: string;
  /** Category id this functor maps to */
  targetCategory: string;
}

/**
 * Validation result returned by all validate methods
 *
 * CLEAR STRUCTURE:
 * - valid: boolean (true if all laws satisfied, false if violations found)
 * - errors: array of error objects (empty if valid)
 */
export interface ValidationResult {
  /** True if all categorical laws are satisfied */
  valid: boolean;
  /** Array of law violations - empty if valid */
  errors: ValidationError[];
}

/**
 * Individual validation error
 *
 * CLEAR STRUCTURE:
 * - message: string (dot notation like "Subject.identityLaw")
 * - path: string[] (property path where error occurred)
 * - constraint: string (which law was violated)
 */
export interface ValidationError {
  /** Error message in dot notation (e.g., "Subject.identityLaw") */
  message: string;
  /** Property path where error occurred */
  path: string[];
  /** Which categorical law was violated */
  constraint: string;
}
