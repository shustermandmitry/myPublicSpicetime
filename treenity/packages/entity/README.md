# @treenity/entity

## About

This is client-server entity library made as simple as possible. It uses `mobx` under the hood
for reactive updates and JSON Patch for sending changes to entities.

### Features

* Entity class with reactive properties
* Automatic entity creation from JSON
* Remote entity methods
* Subscriptions and server updates to remote entities
* TypeObjects for entity static and runtime resolving
* Automatic schema generation for runtime type checking
* Transport-independent API (add your connectors)
* Weak-LRU entities caching, and automatic unsubscription on no links
* FeathersJS hook to translate every method result to entity

### Examples

#### 1. Simplest entity

```typescript
const SimpleType = metaType<SimpleEntity>('simple');

@entity(SimpleType)
class SimpleEntity {
  name!: string;
  age?: number;
}
```

#### 2. Add write methods (actions in mobx)

```typescript
// this will lead to age change and reactive observers to rerun
class X {
  @write
  changeAge(age: number) {
    this.age = age;
  }
}
````

#### 3. Add write methods (actions in mobx)

```typescript
// this will lead to real entity update and calling on patch api on the server
const SimpleType = metaType<SimpleEntity>('simple');

@entity(SimpleType)
class SimpleEntity {
  name!: string;
  age?: number;

  // optimistic method, will be called on the client
  @writeMethod
  changeName(newName: string) {
    this.name = name;
  }
}

// on the server
@entity(SimpleType.server)
class SimpleEntityServer extends SimpleEntity {
  // will be called on the server, and change underlaying entity
  @writeMethod
  changeName(newName: string) {
    this.name = name;
  }
}
````

### Installation

Create token with "api" **scope** [here](https://gitlab.com/-/profile/personal_access_tokens).
Add private registry info to .npmrc file in root of project

```
@treenity:registry=https://gitlab.com/api/v4/projects/35830151/packages/npm/
//gitlab.com/api/v4/projects/35830151/packages/npm/:_authToken=${TOKEN}
```

Install: `TOKEN=<access_token> npm i @treenity/entity`
Publish: `TOKEN=<access_token> npm publish`

