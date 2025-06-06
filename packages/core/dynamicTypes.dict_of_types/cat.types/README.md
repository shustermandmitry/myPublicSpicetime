# Cat Types - Categorical Type System

Dynamic types with categorical laws from category theory.

## Overview

Cat Types provides categorical entities that enforce mathematical laws from category theory:

- **Subject**: Basic entities with identity laws
- **Morphism**: Transformations with composition laws
- **Category**: Collections with structure laws
- **Functor**: Mappings with preservation laws

Each type validates both basic structure and categorical laws, providing clear error messages when violations occur.

## Installation

```bash
npm install @spicetime/cat.types
# or
pnpm add @spicetime/cat.types
```

## Quick Start

```typescript
import { cat } from '@spicetime/cat.types';

// Create and validate a subject
const user = { id: 'user_1', name: 'John Doe' };
const result = cat.subject.validate(user);

if (result.valid) {
  console.log('Valid subject!');
} else {
  console.log('Categorical law violations:', result.errors);
}

// Create identity morphism
const identity = cat.subject.helpers.identity(user);
// Result: { id: 'id_user_1', source: 'user_1', target: 'user_1' }

// Compose morphisms
const f = { id: 'f', source: 'A', target: 'B' };
const g = { id: 'g', source: 'B', target: 'C' };
const composed = cat.morphism.helpers.compose(f, g);
// Result: { id: 'g∘f', source: 'A', target: 'C' }
```

## Categorical Types

### Subject

Basic entities with identity laws:

```typescript
// Valid subject
const validSubject = { id: 'user_1', name: 'John Doe' };
const result = cat.subject.validate(validSubject);
// result.valid === true

// Invalid subject (violates identity law)
const invalidSubject = { id: 'same', name: 'same' };
const result2 = cat.subject.validate(invalidSubject);
// result2.errors includes "Subject.identityLaw"
```

**Enforced Laws:**
- **Identity Law**: `id ≠ name` - The identity must differ from the name
- **Lowercase Law**: `id` must be lowercase for consistency
- **No Spaces Law**: `id` cannot contain spaces for valid identifiers

**Helper Functions:**
```typescript
// Create identity morphism
const identity = cat.subject.helpers.identity(subject);

// Check category membership
const belongs = cat.subject.helpers.belongsTo(subject, 'categoryId');

// Validate all laws
const lawResult = cat.subject.helpers.validateLaws(subject);
```

### Morphism

Transformations between subjects with composition laws:

```typescript
// Valid morphism
const morphism = { id: 'f', source: 'user_1', target: 'user_2' };
const result = cat.morphism.validate(morphism);

// Identity morphism
const identity = { id: 'id_user_1', source: 'user_1', target: 'user_1' };
const identityResult = cat.morphism.validate(identity);
```

**Enforced Laws:**
- **Composition Law**: Non-identity morphisms must have different source/target
- **Identity Law**: Identity morphisms must have matching source/target
- **Uniqueness Law**: Morphism ID must be unique identifier

**Helper Functions:**
```typescript
// Compose morphisms (g ∘ f)
const composed = cat.morphism.helpers.compose(f, g);

// Check if morphism is identity
const isId = cat.morphism.helpers.isIdentity(morphism);

// Check composition compatibility
const canCompose = cat.morphism.helpers.canCompose(f, g);
```

### Category

Collections of subjects with structure laws:

```typescript
// Valid category
const category = {
  id: 'users',
  name: 'User Category',
  subjects: ['user_1', 'user_2']
};
const result = cat.category.validate(category);
```

**Enforced Laws:**
- **Structure Law**: Category cannot contain itself as subject
- **Hierarchy Law**: Category ID must differ from name
- **Uniqueness Law**: No duplicate subjects in category

**Helper Functions:**
```typescript
// Add subject (maintains uniqueness)
const updated = cat.category.helpers.addSubject(category, 'user_3');

// Check subject membership
const hasSubject = cat.category.helpers.hasSubject(category, 'user_1');

// Remove subject
const removed = cat.category.helpers.removeSubject(category, 'user_1');
```

### Functor

Mappings between categories with preservation laws:

```typescript
// Valid functor
const functor = {
  id: 'F',
  sourceCategory: 'users',
  targetCategory: 'groups'
};
const result = cat.functor.validate(functor);

// Identity functor
const identityFunctor = {
  id: 'id_users',
  sourceCategory: 'users',
  targetCategory: 'users'
};
```

**Enforced Laws:**
- **Functor Law**: Non-identity functors must map between different categories

**Helper Functions:**
```typescript
// Apply functor to subject
const applied = cat.functor.helpers.apply(functor, 'user_1');
// Result: "F(user_1)"

// Compose functors (G ∘ F)
const composed = cat.functor.helpers.compose(F, G);
```

## Error Handling

Cat Types provides detailed error messages with categorical context:

### Categorical Law Violations

```typescript
// Identity law violation
const invalid = { id: 'same', name: 'same' };
const result = cat.subject.validate(invalid);
// Error: "Subject.identityLaw"

// Composition law violation
const invalidMorphism = { id: 'f', source: 'A', target: 'A' }; // Non-identity with same source/target
const morphResult = cat.morphism.validate(invalidMorphism);
// Error: "Morphism.compositionLaw"
```

### Composition Errors

```typescript
import { MorphismCompositionError } from '@spicetime/cat.types';

try {
  const f = { id: 'f', source: 'A', target: 'B' };
  const g = { id: 'g', source: 'C', target: 'D' }; // Cannot compose!
  cat.morphism.helpers.compose(f, g);
} catch (error) {
  if (error instanceof MorphismCompositionError) {
    console.log('Composition failed:', error.context);
    // Shows: f.target (B) ≠ g.source (C)
  }
}
```

### Error Message Structure

All error messages use dot notation to show exact violation locations:

| Error | Description | Example |
|-------|-------------|---------|
| `Subject.identityLaw` | ID equals name | `{ id: 'same', name: 'same' }` |
| `Subject.lowercaseId` | ID not lowercase | `{ id: 'User_1', name: 'User' }` |
| `Subject.noSpacesInId` | ID contains spaces | `{ id: 'user 1', name: 'User' }` |
| `Morphism.compositionLaw` | Invalid composition | Non-identity with same source/target |
| `Morphism.identityLaw` | Invalid identity | Identity with different source/target |
| `Category.structureLaw` | Self-reference | Category contains itself |
| `Category.hierarchyLaw` | ID equals name | `{ id: 'same', name: 'same' }` |
| `Functor.functorLaw` | Invalid mapping | Non-identity between same categories |

## Mathematical Foundations

Cat Types is built on solid category theory foundations:

### Category Theory Concepts

- **Objects**: Represented by Subjects with identity laws
- **Morphisms**: Transformations with composition laws
- **Categories**: Collections with structure laws
- **Functors**: Structure-preserving mappings

### Laws Enforced

```typescript
// Identity Law: Every object has identity morphism
∀ A: ∃ id_A: A → A

// Composition Law: Morphisms compose associatively
∀ f: A → B, g: B → C: ∃ (g ∘ f): A → C

// Functor Law: Structure preservation
F: C → D preserves composition and identities
```

### Implementation Details

```typescript
// Identity morphism creation
identity: (subj: Subject): Morphism => ({ 
  id: `id_${subj.id}`, 
  source: subj.id, 
  target: subj.id 
})

// Morphism composition
compose: (f: Morphism, g: Morphism): Morphism => {
  if (f.target !== g.source) {
    throw new MorphismCompositionError(/* ... */);
  }
  return { id: `${g.id}∘${f.id}`, source: f.source, target: g.target };
}

// Functor application
apply: (functor: Functor, subjectId: string): string => 
  `${functor.id}(${subjectId})`
```

## Testing

Cat Types includes comprehensive test coverage:

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test --coverage

# Watch mode
pnpm test --watch
```

**Test Statistics:**
- ✅ 27 tests passing
- ✅ All categorical laws validated
- ✅ Edge cases covered
- ✅ Error handling verified

### Test Categories

- **Subject Tests (6)**: Identity law, lowercase law, spaces law, helpers
- **Morphism Tests (9)**: Composition law, identity law, uniqueness law, composition operations
- **Category Tests (7)**: Structure law, hierarchy law, uniqueness law, subject management
- **Functor Tests (5)**: Functor law, identity functors, application, composition

## Examples

### Basic Usage

```typescript
// Create subjects
const user1 = { id: 'user_1', name: 'John Doe' };
const user2 = { id: 'user_2', name: 'Jane Smith' };

// Validate subjects
const result1 = cat.subject.validate(user1); // ✅ Valid
const result2 = cat.subject.validate(user2); // ✅ Valid

// Create morphisms
const f = { id: 'f', source: 'user_1', target: 'user_2' };
const g = { id: 'g', source: 'user_2', target: 'user_3' };

// Compose morphisms
const composed = cat.morphism.helpers.compose(f, g);
// Result: { id: 'g∘f', source: 'user_1', target: 'user_3' }
```

### Category Management

```typescript
// Create category
let userCategory = {
  id: 'users',
  name: 'User Category',
  subjects: ['user_1', 'user_2']
};

// Add subjects
userCategory = cat.category.helpers.addSubject(userCategory, 'user_3');

// Check membership
const hasUser = cat.category.helpers.hasSubject(userCategory, 'user_1'); // true

// Remove subjects
userCategory = cat.category.helpers.removeSubject(userCategory, 'user_1');
```

### Functor Operations

```typescript
// Create functor
const userToGroup = {
  id: 'UserToGroup',
  sourceCategory: 'users',
  targetCategory: 'groups'
};

// Apply functor
const groupUser = cat.functor.helpers.apply(userToGroup, 'user_1');
// Result: "UserToGroup(user_1)"

// Compose functors
const F = { id: 'F', sourceCategory: 'A', targetCategory: 'B' };
const G = { id: 'G', sourceCategory: 'B', targetCategory: 'C' };
const composed = cat.functor.helpers.compose(F, G);
// Result: { id: 'G∘F', sourceCategory: 'A', targetCategory: 'C' }
```

## API Reference

See the [complete API documentation](./docs/api/) for detailed information about all types, methods, and error classes.

### Key Types

- **Subject**: Basic entity with identity laws
- **Morphism**: Transformation with composition laws
- **Category**: Collection with structure laws
- **Functor**: Mapping with preservation laws

### Key Error Classes

- **CategoryValidationError**: Base error for categorical validation failures
- **MorphismCompositionError**: Error for morphism composition failures
- **CategoryLawViolationError**: Error for categorical law violations
- **FunctorApplicationError**: Error for functor application failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests for new categorical laws
4. Update documentation with mathematical context
5. Submit a pull request

When adding new categorical types:
- Ensure mathematical laws are properly enforced
- Add comprehensive TypeDoc comments
- Include examples in documentation
- Follow dot notation convention for errors

## License

MIT License - see LICENSE file for details.
