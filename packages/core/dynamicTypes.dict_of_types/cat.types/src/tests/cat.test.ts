/**
 * @fileoverview Cat Types Tests
 */

import { describe, it, expect } from 'vitest';
import { cat } from '../cat.js';
import { MorphismCompositionError } from '../errors.js';
import type { Subject, Morphism, Category, Functor } from '../types.js';

describe('Cat Types', () => {
  describe('Subject', () => {
    it('should validate valid subject', () => {
      const validSubject: Subject = {
        id: 'user_1',
        name: 'User One'
      };

      const result = cat.subject.validate(validSubject);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should enforce identity law (id ≠ name)', () => {
      const invalidSubject: Subject = {
        id: 'same',
        name: 'same'
      };

      const result = cat.subject.validate(invalidSubject);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'identityLaw')).toBe(true);
      expect(result.errors.some(e => e.message === 'Subject.identityLaw')).toBe(true);
    });

    it('should enforce lowercase id law', () => {
      const invalidSubject: Subject = {
        id: 'User_1',
        name: 'User One'
      };

      const result = cat.subject.validate(invalidSubject);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'lowercaseId')).toBe(true);
      expect(result.errors.some(e => e.message === 'Subject.lowercaseId')).toBe(true);
    });

    it('should enforce no spaces in id law', () => {
      const invalidSubject: Subject = {
        id: 'user 1',
        name: 'User One'
      };

      const result = cat.subject.validate(invalidSubject);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'noSpacesInId')).toBe(true);
      expect(result.errors.some(e => e.message === 'Subject.noSpacesInId')).toBe(true);
    });

    it('should create identity morphism', () => {
      const subject: Subject = { id: 'user_1', name: 'User One' };
      const identity = cat.subject.helpers.identity(subject);

      expect(identity).toEqual({
        id: 'id_user_1',
        source: 'user_1',
        target: 'user_1'
      });
    });

    it('should validate laws helper', () => {
      const validSubject: Subject = { id: 'user_1', name: 'User One' };
      const invalidSubject: Subject = { id: 'same', name: 'same' };

      const validResult = cat.subject.helpers.validateLaws(validSubject);
      expect(validResult.valid).toBe(true);
      expect(validResult.violations).toHaveLength(0);

      const invalidResult = cat.subject.helpers.validateLaws(invalidSubject);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.violations.length).toBeGreaterThan(0);
    });
  });

  describe('Morphism', () => {
    it('should validate valid morphism', () => {
      const validMorphism: Morphism = {
        id: 'f1',
        source: 'user_1',
        target: 'user_2'
      };

      const result = cat.morphism.validate(validMorphism);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate identity morphism', () => {
      const identityMorphism: Morphism = {
        id: 'id_user_1',
        source: 'user_1',
        target: 'user_1'
      };

      const result = cat.morphism.validate(identityMorphism);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should enforce composition law', () => {
      const invalidMorphism: Morphism = {
        id: 'f1', // Non-identity morphism
        source: 'user_1',
        target: 'user_1' // Same source and target - violates composition law
      };

      const result = cat.morphism.validate(invalidMorphism);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'compositionLaw')).toBe(true);
    });

    it('should enforce identity law', () => {
      const invalidMorphism: Morphism = {
        id: 'id_user_1', // Identity morphism
        source: 'user_1',
        target: 'user_2' // Different source and target - violates identity law
      };

      const result = cat.morphism.validate(invalidMorphism);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'identityLaw')).toBe(true);
    });

    it('should enforce uniqueness law', () => {
      const invalidMorphism: Morphism = {
        id: 'user_1', // Same as source
        source: 'user_1',
        target: 'user_2'
      };

      const result = cat.morphism.validate(invalidMorphism);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'uniquenessLaw')).toBe(true);
    });

    it('should compose morphisms correctly', () => {
      const f: Morphism = { id: 'f', source: 'A', target: 'B' };
      const g: Morphism = { id: 'g', source: 'B', target: 'C' };

      const composed = cat.morphism.helpers.compose(f, g);
      expect(composed).toEqual({
        id: 'g∘f',
        source: 'A',
        target: 'C'
      });
    });

    it('should throw error for invalid composition', () => {
      const f: Morphism = { id: 'f', source: 'A', target: 'B' };
      const g: Morphism = { id: 'g', source: 'C', target: 'D' }; // f.target ≠ g.source

      expect(() => cat.morphism.helpers.compose(f, g)).toThrow(MorphismCompositionError);
    });

    it('should check if morphism is identity', () => {
      const identity: Morphism = { id: 'id_user_1', source: 'user_1', target: 'user_1' };
      const regular: Morphism = { id: 'f1', source: 'user_1', target: 'user_2' };

      expect(cat.morphism.helpers.isIdentity(identity)).toBe(true);
      expect(cat.morphism.helpers.isIdentity(regular)).toBe(false);
    });

    it('should check composition compatibility', () => {
      const f: Morphism = { id: 'f', source: 'A', target: 'B' };
      const g1: Morphism = { id: 'g1', source: 'B', target: 'C' }; // Compatible
      const g2: Morphism = { id: 'g2', source: 'C', target: 'D' }; // Not compatible

      expect(cat.morphism.helpers.canCompose(f, g1)).toBe(true);
      expect(cat.morphism.helpers.canCompose(f, g2)).toBe(false);
    });
  });

  describe('Category', () => {
    it('should validate valid category', () => {
      const validCategory: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1', 'user_2']
      };

      const result = cat.category.validate(validCategory);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should enforce structure law (category cannot contain itself)', () => {
      const invalidCategory: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1', 'users', 'user_2'] // Contains itself
      };

      const result = cat.category.validate(invalidCategory);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'structureLaw')).toBe(true);
    });

    it('should enforce hierarchy law (id ≠ name)', () => {
      const invalidCategory: Category = {
        id: 'same',
        name: 'same',
        subjects: ['user_1']
      };

      const result = cat.category.validate(invalidCategory);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'hierarchyLaw')).toBe(true);
    });

    it('should enforce uniqueness law (no duplicate subjects)', () => {
      const invalidCategory: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1', 'user_2', 'user_1'] // Duplicate
      };

      const result = cat.category.validate(invalidCategory);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'uniquenessLaw')).toBe(true);
    });

    it('should add subject maintaining uniqueness', () => {
      const category: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1']
      };

      const updated = cat.category.helpers.addSubject(category, 'user_2');
      expect(updated.subjects).toEqual(['user_1', 'user_2']);

      // Adding duplicate should not create duplicate
      const updated2 = cat.category.helpers.addSubject(updated, 'user_1');
      expect(updated2.subjects).toEqual(['user_1', 'user_2']);
    });

    it('should check if subject is in category', () => {
      const category: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1', 'user_2']
      };

      expect(cat.category.helpers.hasSubject(category, 'user_1')).toBe(true);
      expect(cat.category.helpers.hasSubject(category, 'user_3')).toBe(false);
    });

    it('should remove subject from category', () => {
      const category: Category = {
        id: 'users',
        name: 'User Category',
        subjects: ['user_1', 'user_2', 'user_3']
      };

      const updated = cat.category.helpers.removeSubject(category, 'user_2');
      expect(updated.subjects).toEqual(['user_1', 'user_3']);
    });
  });

  describe('Functor', () => {
    it('should validate valid functor', () => {
      const validFunctor: Functor = {
        id: 'F',
        sourceCategory: 'users',
        targetCategory: 'groups'
      };

      const result = cat.functor.validate(validFunctor);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate identity functor', () => {
      const identityFunctor: Functor = {
        id: 'id_users',
        sourceCategory: 'users',
        targetCategory: 'users'
      };

      const result = cat.functor.validate(identityFunctor);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should enforce functor law', () => {
      const invalidFunctor: Functor = {
        id: 'F', // Non-identity functor
        sourceCategory: 'users',
        targetCategory: 'users' // Same categories - violates functor law
      };

      const result = cat.functor.validate(invalidFunctor);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.constraint === 'functorLaw')).toBe(true);
    });

    it('should apply functor to subject', () => {
      const functor: Functor = {
        id: 'F',
        sourceCategory: 'users',
        targetCategory: 'groups'
      };

      const result = cat.functor.helpers.apply(functor, 'user_1');
      expect(result).toBe('F(user_1)');
    });

    it('should compose functors', () => {
      const F: Functor = { id: 'F', sourceCategory: 'A', targetCategory: 'B' };
      const G: Functor = { id: 'G', sourceCategory: 'B', targetCategory: 'C' };

      const composed = cat.functor.helpers.compose(F, G);
      expect(composed).toEqual({
        id: 'G∘F',
        sourceCategory: 'A',
        targetCategory: 'C'
      });
    });
  });
});
