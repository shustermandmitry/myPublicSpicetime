/**
 * @fileoverview Cat Types Errors - Custom error types for categorical validation
 *
 * This module provides specialized error types for categorical law violations.
 * Each error type includes detailed context about what went wrong and why.
 *
 * @example
 * ```typescript
 * import { MorphismCompositionError } from '@spicetime/cat.types';
 *
 * try {
 *   const f = { id: 'f', source: 'A', target: 'B' };
 *   const g = { id: 'g', source: 'C', target: 'D' }; // Cannot compose!
 *   cat.morphism.helpers.compose(f, g);
 * } catch (error) {
 *   if (error instanceof MorphismCompositionError) {
 *     console.log('Composition failed:', error.context);
 *   }
 * }
 * ```
 */

/**
 * Error thrown when categorical validation fails
 *
 * This error is thrown when a categorical entity (Subject, Morphism, Category, or Functor)
 * fails validation against its categorical laws. It includes detailed information about
 * which laws were violated.
 *
 * @example
 * ```typescript
 * // This will throw CategoryValidationError
 * const invalidSubject = { id: 'same', name: 'same' }; // Violates identity law
 * try {
 *   cat.subject.validate(invalidSubject);
 * } catch (error) {
 *   console.log(error.context.violations); // ["Subject.identityLaw"]
 * }
 * ```
 */
export class CategoryValidationError extends Error {
  constructor(
    message: string,
    public context: {
      context: string;
      violations: string[];
      structure: string;
      totalViolations: number;
    }
  ) {
    super(message);
    this.name = 'CategoryValidationError';
  }
}

/**
 * Error for categorical law violations
 */
export class CategoryLawViolationError extends Error {
  constructor(
    message: string,
    public context: {
      law: string;
      violation: string;
      entity: any;
      path: string[];
    }
  ) {
    super(message);
    this.name = 'CategoryLawViolationError';
  }
}

/**
 * Error thrown when morphism composition fails
 *
 * This error occurs when attempting to compose two morphisms that cannot be composed
 * according to category theory rules. For morphisms f: A → B and g: B → C to be
 * composable, f.target must equal g.source.
 *
 * @example
 * ```typescript
 * const f = { id: 'f', source: 'A', target: 'B' };
 * const g = { id: 'g', source: 'C', target: 'D' }; // f.target ≠ g.source
 *
 * try {
 *   cat.morphism.helpers.compose(f, g);
 * } catch (error) {
 *   console.log(error.message); // "Cannot compose: f.target (B) ≠ g.source (C)"
 *   console.log(error.context.f); // Original f morphism
 *   console.log(error.context.g); // Original g morphism
 * }
 * ```
 */
export class MorphismCompositionError extends Error {
  constructor(
    message: string,
    public context: {
      f: any;
      g: any;
      law: string;
      reason?: string;
    }
  ) {
    super(message);
    this.name = 'MorphismCompositionError';
  }
}

/**
 * Error for functor application failures
 */
export class FunctorApplicationError extends Error {
  constructor(
    message: string,
    public context: {
      functor: any;
      target: any;
      operation: string;
      reason?: string;
    }
  ) {
    super(message);
    this.name = 'FunctorApplicationError';
  }
}
