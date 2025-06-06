/**
 * @fileoverview Cat Types - Composable categorical types
 * 
 * Built step by step using base type composition.
 * Each type extends the previous, building functionality incrementally.
 */

import { t } from '@spicetime/base.types';

// Step 1: Basic subject identity
const subjectId = t.string().min(1);
const subjectName = t.string().min(1);

// Step 2: Compose basic subject
export const subject = t.object({
  id: subjectId,
  name: subjectName
});

// Example: { id: 'user-1', name: 'User Profile' }

// Step 3: Add properties to subject
export const subjectWithProps = subject.extend({
  properties: t.object({})
});

// Example: { id: 'user-1', name: 'User Profile', properties: { email: 'test@example.com' } }

// Step 4: Basic morphism between subjects
export const morphism = t.object({
  id: subjectId,
  source: subjectId,
  target: subjectId
});

// Example: { id: 'transform-1', source: 'user-1', target: 'profile-1' }

// Step 5: Category groups subjects
export const category = t.object({
  id: subjectId,
  name: subjectName,
  subjects: t.array(subjectId)
});

// Example: { id: 'users', name: 'User Entities', subjects: ['user-1', 'user-2'] }

// Step 6: Functor maps between categories
const basicFunctor = t.object({
  id: subjectId,
  sourceCategory: subjectId,
  targetCategory: subjectId
});

// Step 7: Functor namespace - child namespace as specified
export const functor = {
  basic: basicFunctor,
  identity: t.object({
    id: subjectId,
    category: subjectId
  })
};

// Example: functor.basic = { id: 'user-to-profile', sourceCategory: 'users', targetCategory: 'profiles' }

// Step 8: Classification ties it together
export const classification = t.object({
  subjectId,
  categoryId: subjectId,
  confidence: t.number().min(0).max(1)
});

// Example: { subjectId: 'unknown-entity', categoryId: 'users', confidence: 0.85 }

// Step 9: Main cat API - simple namespace for t.cat integration
export const cat = {
  subject,
  subjectWithProps,
  morphism,
  category,
  functor,
  classification
};

// Usage: t.cat.subject.validate({ id: 'test', name: 'Test' })
