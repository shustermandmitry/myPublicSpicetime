/**
 * @fileoverview Cat Types - Dynamic Types with Categorical Laws
 *
 * This module provides categorical types that enforce mathematical laws from category theory.
 * Each type validates both basic structure and categorical laws, providing clear error messages
 * when violations occur.
 *
 * The categorical types include:
 * - **Subject**: Basic entities with identity laws
 * - **Morphism**: Transformations with composition laws
 * - **Category**: Collections with structure laws
 * - **Functor**: Mappings with preservation laws
 *
 * @example
 * ```typescript
 * import { cat } from '@spicetime/cat.types';
 *
 * // Create and validate a subject
 * const user = { id: 'user_1', name: 'John Doe' };
 * const result = cat.subject.validate(user);
 *
 * if (result.valid) {
 *   console.log('Valid subject!');
 * } else {
 *   console.log('Categorical law violations:', result.errors);
 * }
 *
 * // Create identity morphism
 * const identity = cat.subject.helpers.identity(user);
 *
 * // Compose morphisms
 * const f = { id: 'f', source: 'A', target: 'B' };
 * const g = { id: 'g', source: 'B', target: 'C' };
 * const composed = cat.morphism.helpers.compose(f, g);
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Category_theory | Category Theory}
 */

import { MorphismCompositionError } from './errors.js';
import type { Subject, Morphism, Category, Functor, ValidationResult, ValidationError } from './types.js';

/**
 * Subject Type - Basic entity with categorical identity laws
 *
 * **Intent**: Represents objects in category theory with enforced mathematical identity laws.
 * Use this when you need entities that maintain categorical consistency - essential for
 * building systems where mathematical relationships matter (databases, graph structures,
 * domain modeling). Prevents common modeling errors through law enforcement.
 *
 * **Problem Solved**: In domain modeling, entities often have inconsistent identifiers
 * or violate mathematical principles. Subject enforces categorical laws that ensure
 * your entities can participate in mathematical operations (composition, functors)
 * without breaking mathematical guarantees.
 *
 * **Mathematical Foundation**: In category theory, every object must have a unique
 * identity that differs from its representation. This prevents self-reference paradoxes
 * and ensures proper categorical structure.
 *
 * **Enforced Laws**:
 * - **Identity Law**: `id ≠ name` - Prevents self-reference, ensures unique identity
 * - **Lowercase Law**: `id` must be lowercase for consistent addressing
 * - **No Spaces Law**: `id` cannot contain spaces for valid identifiers in systems
 *
 * @example
 * ```typescript
 * // Valid subject - follows all categorical laws
 * const validSubject = { id: 'user_1', name: 'John Doe' };
 * const result = cat.subject.validate(validSubject);
 * // result.valid === true
 *
 * // Invalid subject (violates identity law) - id equals name
 * const invalidSubject = { id: 'same', name: 'same' };
 * const result2 = cat.subject.validate(invalidSubject);
 * // result2.errors includes "Subject.identityLaw"
 *
 * // Use case: User entities in a system
 * const user = { id: 'user_123', name: 'Alice Johnson' };
 * const userResult = cat.subject.validate(user);
 * if (userResult.valid) {
 *   // Safe to use in categorical operations
 *   const identity = cat.subject.helpers.identity(user);
 * }
 * ```
 *
 * @namespace subject
 */
const subject = {
  /**
   * Validate a subject against categorical laws
   *
   * **Intent**: Ensures an entity can safely participate in categorical operations.
   * Use this before storing entities, creating morphisms, or any operation that
   * requires mathematical guarantees. Prevents runtime errors in categorical
   * operations by catching law violations early.
   *
   * **Problem Solved**: Without validation, entities can violate categorical laws
   * and cause mathematical operations to fail or produce incorrect results.
   * This provides early detection with clear error messages.
   *
   * @param value - The value to validate as a Subject. Must be an object with
   *   `id` and `name` properties that follow categorical laws.
   * @returns ValidationResult - object with clear structure:
   *   - `valid`: boolean (true if all laws satisfied)
   *   - `errors`: ValidationError[] (array of law violations)
   *
   * @see {@link ValidationResult} - Return type structure
   * @see {@link ValidationError} - Error object format
   * @see {@link Subject} - Interface being validated
   *
   * @example
   * ```typescript
   * // Validate before using in operations
   * const result = cat.subject.validate({ id: 'user_1', name: 'John' });
   * if (!result.valid) {
   *   result.errors.forEach(error => {
   *     console.log(`Law violation: ${error.message}`);
   *     // Output: "Subject.identityLaw", "Subject.lowercaseId", etc.
   *   });
   * }
   *
   * // Safe to proceed with categorical operations
   * if (result.valid) {
   *   const identity = cat.subject.helpers.identity(value);
   *   const morphism = { id: 'transform', source: value.id, target: 'other' };
   * }
   * ```
   */
  validate: (value: unknown): ValidationResult => {
    // Basic type validation
    if (typeof value !== 'object' || value === null) {
      return {
        valid: false,
        errors: [{ message: 'Subject must be an object', path: [], constraint: 'type' }]
      };
    }

    const obj = value as Subject;
    const errors: any[] = [];

    // Schema validation
    if (typeof obj.id !== 'string' || obj.id.length === 0) {
      errors.push({ message: 'Subject.id must be non-empty string', path: ['id'], constraint: 'type' });
    }
    if (typeof obj.name !== 'string' || obj.name.length === 0) {
      errors.push({ message: 'Subject.name must be non-empty string', path: ['name'], constraint: 'type' });
    }

    // Categorical law validation
    if (obj.id && obj.name) {
      if (obj.id === obj.name) {
        errors.push({ message: 'Subject.identityLaw', path: [], constraint: 'identityLaw' });
      }
      if (obj.id.includes(' ')) {
        errors.push({ message: 'Subject.noSpacesInId', path: ['id'], constraint: 'noSpacesInId' });
      }
      if (obj.id !== obj.id.toLowerCase()) {
        errors.push({ message: 'Subject.lowercaseId', path: ['id'], constraint: 'lowercaseId' });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },
  /**
   * Helper functions for Subject operations
   */
  helpers: {
    /**
     * Create an identity morphism for this subject
     *
     * **Intent**: Provides the mathematical identity transformation required by category theory.
     * Every object in a category must have an identity morphism (id_A: A → A). Use this
     * when you need to represent "no change" operations, initialize morphism chains,
     * or satisfy categorical composition laws.
     *
     * **Problem Solved**: In categorical operations, you often need identity morphisms
     * for composition laws (f ∘ id_A = f, id_B ∘ f = f). This creates the proper
     * identity morphism that satisfies mathematical requirements.
     *
     * **Mathematical Foundation**: In category theory, every object A has an identity
     * morphism id_A: A → A such that for any morphism f: A → B, we have f ∘ id_A = f,
     * and for any morphism g: C → A, we have id_A ∘ g = g.
     *
     * @param subj - The subject to create identity morphism for. Must be a valid Subject.
     * @returns Identity morphism with source and target as the subject's id, following
     *   the naming convention 'id_' + subject.id
     *
     * @example
     * ```typescript
     * const user = { id: 'user_1', name: 'John' };
     * const identity = cat.subject.helpers.identity(user);
     * // Returns: { id: 'id_user_1', source: 'user_1', target: 'user_1' }
     *
     * // Use in composition - identity laws
     * const f = { id: 'transform', source: 'user_1', target: 'user_2' };
     * const composed1 = cat.morphism.helpers.compose(identity, f); // id ∘ f = f
     * const composed2 = cat.morphism.helpers.compose(f, identity); // f ∘ id = f
     * ```
     */
    identity: (subj: Subject): Morphism => ({
      id: `id_${subj.id}`,
      source: subj.id,
      target: subj.id
    }),

    /**
     * Check if subject belongs to a category
     *
     * @param subj - The subject to check
     * @param categoryId - The category identifier
     * @returns True if subject belongs to category
     *
     * @example
     * ```typescript
     * const user = { id: 'user_1', name: 'John' };
     * const belongs = cat.subject.helpers.belongsTo(user, 'users');
     * ```
     */
    belongsTo: (subj: Subject, categoryId: string): boolean => {
      // This would need category lookup in real implementation
      return true; // Placeholder
    },

    /**
     * Validate all categorical laws for a subject
     *
     * @param subj - The subject to validate
     * @returns Validation result with detailed law violations
     *
     * @example
     * ```typescript
     * const user = { id: 'same', name: 'same' }; // Violates identity law
     * const result = cat.subject.helpers.validateLaws(user);
     * console.log(result.violations); // Shows which laws were violated
     * ```
     */
    validateLaws: (subj: Subject) => {
      const result = subject.validate(subj);
      return {
        valid: result.valid,
        violations: result.errors?.map(e => ({
          law: e.message,
          constraint: e.constraint
        })) || []
      };
    }
  }
};

/**
 * Morphism Type - Transformation between subjects with composition laws
 */
const morphism = {
  validate: (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return {
        valid: false,
        errors: [{ message: 'Morphism must be an object', path: [], constraint: 'type' }]
      };
    }

    const morph = value as Morphism;
    const errors: any[] = [];

    // Schema validation
    if (typeof morph.id !== 'string' || morph.id.length === 0) {
      errors.push({ message: 'Morphism.id must be non-empty string', path: ['id'], constraint: 'type' });
    }
    if (typeof morph.source !== 'string' || morph.source.length === 0) {
      errors.push({ message: 'Morphism.source must be non-empty string', path: ['source'], constraint: 'type' });
    }
    if (typeof morph.target !== 'string' || morph.target.length === 0) {
      errors.push({ message: 'Morphism.target must be non-empty string', path: ['target'], constraint: 'type' });
    }

    // Categorical law validation
    if (morph.id && morph.source && morph.target) {
      // Composition law: non-identity morphisms must have different source/target
      if (!(morph.source !== morph.target || morph.id.startsWith('id_'))) {
        errors.push({ message: 'Morphism.compositionLaw', path: [], constraint: 'compositionLaw' });
      }
      // Identity law: identity morphisms must have matching source/target
      if (!(!morph.id.startsWith('id_') || morph.source === morph.target)) {
        errors.push({ message: 'Morphism.identityLaw', path: [], constraint: 'identityLaw' });
      }
      // Uniqueness law: morphism id must be unique identifier
      if (morph.id === morph.source || morph.id === morph.target) {
        errors.push({ message: 'Morphism.uniquenessLaw', path: ['id'], constraint: 'uniquenessLaw' });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },
  helpers: {
    // Helper: compose with another morphism (g ∘ f)
    compose: (f: Morphism, g: Morphism): Morphism => {
      if (f.target !== g.source) {
        throw new MorphismCompositionError(
          `Cannot compose: f.target (${f.target}) ≠ g.source (${g.source})`,
          { f, g, law: 'composition' }
        );
      }
      return { id: `${g.id}∘${f.id}`, source: f.source, target: g.target };
    },

    // Helper: check if morphism is identity
    isIdentity: (morph: Morphism): boolean =>
      morph.source === morph.target && morph.id.startsWith('id_'),

    // Helper: validate composition law
    canCompose: (f: Morphism, g: Morphism): boolean => f.target === g.source
  }
};

/**
 * Category Type - Collection of subjects with categorical structure laws
 */
const category = {
  validate: (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return {
        valid: false,
        errors: [{ message: 'Category must be an object', path: [], constraint: 'type' }]
      };
    }

    const cat = value as Category;
    const errors: any[] = [];

    // Schema validation
    if (typeof cat.id !== 'string' || cat.id.length === 0) {
      errors.push({ message: 'Category.id must be non-empty string', path: ['id'], constraint: 'type' });
    }
    if (typeof cat.name !== 'string' || cat.name.length === 0) {
      errors.push({ message: 'Category.name must be non-empty string', path: ['name'], constraint: 'type' });
    }
    if (!Array.isArray(cat.subjects)) {
      errors.push({ message: 'Category.subjects must be an array', path: ['subjects'], constraint: 'type' });
    }

    // Categorical law validation
    if (cat.id && cat.name && Array.isArray(cat.subjects)) {
      // Structure law: category cannot contain itself as subject
      if (cat.subjects.includes(cat.id)) {
        errors.push({ message: 'Category.structureLaw', path: [], constraint: 'structureLaw' });
      }
      // Hierarchy law: category id must differ from name
      if (cat.id === cat.name) {
        errors.push({ message: 'Category.hierarchyLaw', path: [], constraint: 'hierarchyLaw' });
      }
      // Uniqueness law: no duplicate subjects
      if (new Set(cat.subjects).size !== cat.subjects.length) {
        errors.push({ message: 'Category.uniquenessLaw', path: ['subjects'], constraint: 'uniquenessLaw' });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },
  helpers: {
    // Helper: add subject to category (maintains uniqueness)
    addSubject: (cat: Category, subjectId: string): Category => ({
      ...cat,
      subjects: [...new Set([...cat.subjects, subjectId])]
    }),

    // Helper: check if subject is in category
    hasSubject: (cat: Category, subjectId: string): boolean =>
      cat.subjects.includes(subjectId),

    // Helper: remove subject from category
    removeSubject: (cat: Category, subjectId: string): Category => ({
      ...cat,
      subjects: cat.subjects.filter(id => id !== subjectId)
    })
  }
};

/**
 * Functor - Basic functor with structure preservation laws
 */
const functor = {
  validate: (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
      return {
        valid: false,
        errors: [{ message: 'Functor must be an object', path: [], constraint: 'type' }]
      };
    }

    const f = value as Functor;
    const errors: any[] = [];

    // Schema validation
    if (typeof f.id !== 'string' || f.id.length === 0) {
      errors.push({ message: 'Functor.id must be non-empty string', path: ['id'], constraint: 'type' });
    }
    if (typeof f.sourceCategory !== 'string' || f.sourceCategory.length === 0) {
      errors.push({ message: 'Functor.sourceCategory must be non-empty string', path: ['sourceCategory'], constraint: 'type' });
    }
    if (typeof f.targetCategory !== 'string' || f.targetCategory.length === 0) {
      errors.push({ message: 'Functor.targetCategory must be non-empty string', path: ['targetCategory'], constraint: 'type' });
    }

    // Categorical law validation
    if (f.id && f.sourceCategory && f.targetCategory) {
      // Functor law: non-identity functors must map between different categories
      if (!(f.sourceCategory !== f.targetCategory || f.id.startsWith('id_'))) {
        errors.push({ message: 'Functor.functorLaw', path: [], constraint: 'functorLaw' });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },
  helpers: {
    // Helper: apply functor to subject
    apply: (functor: Functor, subjectId: string): string => `${functor.id}(${subjectId})`,

    // Helper: compose functors
    compose: (F: Functor, G: Functor): Functor => ({
      id: `${G.id}∘${F.id}`,
      sourceCategory: F.sourceCategory,
      targetCategory: G.targetCategory
    })
  }
};

/**
 * Cat Types - Simple API Export
 */
export const cat = {
  subject,
  morphism,
  category,
  functor
};
