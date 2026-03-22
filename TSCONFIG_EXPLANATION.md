# TypeScript Configuration (tsconfig.json) - Complete Guide

## Overview
`tsconfig.json` is the configuration file for TypeScript compiler. It tells TypeScript how to compile your code, what features to enable, and how strict the type checking should be.

---

## File Layout Options

### `rootDir` (commented)
- **Purpose**: Specifies the root directory of input files
- **Example**: `"rootDir": "./src"`
- **Functionality**: Only files under this directory will be included. Output directory structure mirrors this.
- **When to use**: When you have a `src/` folder and want organized output

### `outDir` (commented)
- **Purpose**: Redirects output structure to a directory
- **Example**: `"outDir": "./dist"`
- **Functionality**: Compiled JavaScript files go here instead of alongside source files
- **When to use**: Keeps source and compiled code separate

#### Detailed Explanation:
- **What it does**: All compiled `.js`, `.d.ts`, and `.map` files go into this directory
- **Directory structure**: Mirrors your source structure
  ```
  src/
    app.ts
    utils/
      helper.ts
  ```
  With `outDir: "dist"` becomes:
  ```
  dist/
    app.js
    utils/
      helper.js
  ```
- **Default behavior**: If omitted, files are placed next to source files
- **Best practice**: Always use this to keep source and output separate
- **Note**: Works with `rootDir` - output structure mirrors source structure

---

## Module Interoperability & Resolution

### `esModuleInterop: true`
- **Purpose**: Enables interoperability between CommonJS and ES modules
- **Functionality**: 
  - Allows importing CommonJS modules using ES6 `import` syntax
  - Automatically handles default exports from CommonJS modules
  - Creates compatibility layer between module systems

#### What it does:
**Without `esModuleInterop`**:
```typescript
// ❌ Error: Module has no default export
import express from 'express';

// ✅ Must use this instead:
import * as express from 'express';
const express = require('express');
```

**With `esModuleInterop: true`**:
```typescript
// ✅ Works! Automatically handles CommonJS default exports
import express from 'express';
```

#### How it works:
- TypeScript generates helper code to bridge CommonJS and ES modules
- Converts `module.exports = ...` to work with `import ... from ...`
- Handles default exports from CommonJS modules

#### Alternatives:

**`esModuleInterop: true`** (Recommended)
- **When to use**: 
  - Mixing CommonJS and ES modules
  - Using npm packages that are CommonJS
  - Modern projects with `import` syntax
- **Pros**: 
  - Seamless CommonJS/ES module interop
  - Cleaner import syntax
  - Works with most npm packages
- **Cons**: 
  - Slightly larger output (helper code)
  - Not needed if using pure ES modules

**`esModuleInterop: false`** (Strict)
- **When to use**: 
  - Pure ES module projects
  - Want to avoid helper code
  - Explicit about module system
- **Pros**: 
  - Smaller output
  - No compatibility layer
- **Cons**: 
  - Can't easily import CommonJS modules
  - Must use `import * as` or `require()`

**Note**: When using `module: "nodenext"`, `esModuleInterop` is automatically handled by Node.js, so you may not need it explicitly.

---

### `moduleResolution: "node"`
- **Purpose**: Specifies how TypeScript resolves module imports
- **Functionality**: 
  - Determines how `import` statements find their modules
  - Controls path resolution algorithm
  - Affects how TypeScript looks for `.ts`, `.js`, and `.d.ts` files

#### What it does:
Controls how TypeScript resolves these imports:
```typescript
import express from 'express';
import { helper } from './utils/helper';
import config from '../config';
```

#### Resolution Strategy:
1. **Node.js resolution** (`"node"` or `"node16"`):
   - Looks in `node_modules/`
   - Checks `package.json` for `main`, `module`, `exports`
   - Supports `index.ts`, `index.js`
   - Follows Node.js module resolution rules

2. **Classic resolution** (`"classic"`):
   - Older, simpler resolution
   - Doesn't check `node_modules` automatically
   - Less sophisticated
   - **Deprecated**: Don't use this

#### Alternatives:

**`moduleResolution: "node"`** (Classic Node)
- **What it does**: Uses Node.js-style module resolution
- **When to use**: 
  - CommonJS projects
  - Legacy projects
  - `module: "commonjs"`
- **Pros**: 
  - Well-established
  - Works with CommonJS
- **Cons**: 
  - Doesn't fully support ES modules
  - Older algorithm

**`moduleResolution: "node16"` or `"nodenext"`** (Modern Node)
- **What it does**: Modern Node.js resolution with ES module support
- **When to use**: 
  - ES modules (`module: "nodenext"`)
  - Node.js 16+ projects
  - Modern projects
- **Features**: 
  - Supports `package.json` `exports` field
  - Handles `.mjs` and `.cjs` files
  - Respects `"type": "module"`
- **Pros**: 
  - Full ES module support
  - Modern Node.js features
  - Better package.json support
- **Cons**: 
  - Requires Node.js 16+
  - More complex

**`moduleResolution: "bundler"** (Bundler Mode)
- **What it does**: Resolution for bundlers (webpack, vite, etc.)
- **When to use**: 
  - Frontend projects with bundlers
  - Using webpack, vite, esbuild
  - Browser projects
- **Features**: 
  - Supports extensionless imports
  - Handles `package.json` `exports` and `imports`
  - Optimized for bundlers
- **Pros**: 
  - Works great with bundlers
  - Modern resolution
- **Cons**: 
  - Not for Node.js runtime
  - Requires bundler

**`moduleResolution: "classic"`** (Deprecated)
- **What it does**: Old TypeScript resolution
- **When to use**: Never (deprecated)
- **Pros**: None
- **Cons**: 
  - Doesn't work with `node_modules`
  - Outdated
  - **Don't use this!**

**Auto-detection** (Omitted)
- **What it does**: TypeScript picks based on `module` setting
- **When to use**: Let TypeScript decide
- **Rules**: 
  - `module: "nodenext"` → `moduleResolution: "nodenext"`
  - `module: "node16"` → `moduleResolution: "node16"`
  - `module: "commonjs"` → `moduleResolution: "node"`
  - `module: "esnext"` → `moduleResolution: "bundler"`

**For your config**: Since you use `module: "nodenext"`, you should use `moduleResolution: "nodenext"` (or omit it - it auto-detects).

---

## Decorators & Metadata

### `experimentalDecorators: true`
- **Purpose**: Enables experimental decorator support
- **Functionality**: 
  - Allows using decorators (annotations) in TypeScript
  - Enables patterns like `@Component`, `@Injectable`, `@Get()`
  - Used by frameworks like NestJS, Angular, TypeORM

#### What are decorators?
Decorators are a way to add metadata or modify classes, methods, properties:
```typescript
// Without decorators
class UserController {
  getUsers() {
    return [];
  }
}

// With decorators (NestJS example)
@Controller('users')
class UserController {
  @Get()
  getUsers() {
    return [];
  }
}
```

#### Common Use Cases:
1. **NestJS** (Backend Framework):
   ```typescript
   @Controller('users')
   export class UsersController {
     @Get()
     findAll() {
       return [];
     }
   }
   ```

2. **TypeORM** (ORM):
   ```typescript
   @Entity()
   export class User {
     @PrimaryGeneratedColumn()
     id: number;
     
     @Column()
     name: string;
   }
   ```

3. **Angular** (Frontend):
   ```typescript
   @Component({
     selector: 'app-user',
     template: '<div>User</div>'
   })
   export class UserComponent {}
   ```

#### Alternatives:

**`experimentalDecorators: true`** (Enable)
- **When to use**: 
  - Using NestJS, Angular, TypeORM
  - Need decorator syntax
  - Framework requires it
- **Pros**: 
  - Enables decorator syntax
  - Required for many frameworks
- **Cons**: 
  - Still "experimental" (not finalized)
  - May change in future
  - Requires `emitDecoratorMetadata` for full features

**`experimentalDecorators: false`** (Disable)
- **When to use**: 
  - Not using decorators
  - Plain TypeScript projects
  - Want to avoid experimental features
- **Pros**: 
  - No experimental features
  - More stable
- **Cons**: 
  - Can't use decorator syntax
  - Frameworks won't work

**Note**: Decorators are being standardized in JavaScript (Stage 3), but TypeScript's implementation is still experimental.

---

### `emitDecoratorMetadata: true`
- **Purpose**: Emits decorator metadata for runtime reflection
- **Functionality**: 
  - Adds type information to decorators at runtime
  - Enables dependency injection
  - Required for frameworks that need type information

#### What it does:
Adds type metadata that can be read at runtime:
```typescript
// TypeScript code
class UserService {
  constructor(private userRepository: UserRepository) {}
}

// With emitDecoratorMetadata, TypeScript adds:
// Runtime metadata about UserRepository type
```

#### When it's needed:
- **Dependency Injection**: Frameworks need to know what types to inject
- **NestJS**: Requires this to inject dependencies
- **TypeORM**: Needs type info for entity relationships
- **Angular**: Uses it for dependency injection

#### Example with NestJS:
```typescript
// Without emitDecoratorMetadata: true
// ❌ NestJS can't determine what to inject

// With emitDecoratorMetadata: true
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  // ✅ NestJS knows to inject Repository<User>
}
```

#### Alternatives:

**`emitDecoratorMetadata: true`** (Enable)
- **When to use**: 
  - Using NestJS, Angular, TypeORM
  - Need dependency injection
  - Framework requires runtime type info
- **Pros**: 
  - Enables dependency injection
  - Required for many frameworks
  - Runtime type information
- **Cons**: 
  - Larger output (adds metadata)
  - Requires `experimentalDecorators: true`
  - Adds runtime overhead

**`emitDecoratorMetadata: false`** (Disable)
- **When to use**: 
  - Not using dependency injection
  - Simple decorators only
  - Don't need runtime type info
- **Pros**: 
  - Smaller output
  - No metadata overhead
- **Cons**: 
  - Can't use dependency injection
  - Frameworks won't work properly

**Important**: `emitDecoratorMetadata` requires `experimentalDecorators: true` to work.

**Note**: Requires `reflect-metadata` package to be imported in your code:
```typescript
import 'reflect-metadata'; // Must be at the top of your entry file
```

---

## Environment Settings

### `module: "nodenext"`
- **Purpose**: Specifies the module system for the compiled code
- **Value**: `"nodenext"` (Node.js ESM support)
- **Functionality**: 
  - Uses Node.js's native ES module system
  - Respects `"type": "module"` in package.json
  - Supports both `.js` and `.mjs` files
  - Uses `import/export` syntax
  - Best for Node.js 14+ with ES modules

#### Alternatives:

**`"commonjs"`** (CommonJS)
- **What it does**: Compiles to `require()` and `module.exports`
- **When to use**: 
  - Legacy Node.js projects
  - Projects without `"type": "module"` in package.json
  - Libraries that need maximum compatibility
- **Example output**:
  ```javascript
  // TypeScript: import express from 'express';
  // Output: const express = require('express');
  ```
- **Pros**: Universal compatibility, works everywhere
- **Cons**: Older syntax, no tree-shaking, larger bundles

**`"esnext"`** (Latest ES Modules)
- **What it does**: Uses latest ES module features, but not Node.js-specific
- **When to use**: 
  - Browser-focused projects
  - Bundler-based projects (webpack, vite, etc.)
  - When you want latest features but don't need Node.js resolution
- **Pros**: Modern syntax, good for bundlers
- **Cons**: Doesn't understand Node.js module resolution

**`"es2020"`, `"es2021"`, `"es2022"`** (Specific ES Versions)
- **What it does**: Uses specific ES module standard
- **When to use**: 
  - When you need specific feature set
  - Targeting specific environments
  - More predictable output
- **Example**: `"es2022"` includes top-level await, class fields
- **Pros**: Predictable, specific feature set
- **Cons**: May not include latest features

**`"amd"`** (Asynchronous Module Definition)
- **What it does**: Compiles to AMD format (RequireJS)
- **When to use**: Legacy browser projects using RequireJS
- **Rarely used**: Mostly legacy codebases

**`"umd"`** (Universal Module Definition)
- **What it does**: Creates modules that work in CommonJS, AMD, and globals
- **When to use**: Libraries that need to work everywhere
- **Pros**: Maximum compatibility
- **Cons**: Larger output, more complex

**`"system"`** (SystemJS)
- **What it does**: Compiles to SystemJS format
- **When to use**: Projects using SystemJS loader
- **Rarely used**: Niche use case

### `target: "esnext"`
- **Purpose**: Sets the JavaScript version for compiled output
- **Value**: `"esnext"` (latest ECMAScript features)
- **Functionality**: 
  - Compiles to the latest JavaScript syntax
  - Uses modern features like async/await, optional chaining, etc.
  - Requires a modern Node.js version (14+)
  - Minimal transpilation - keeps your code mostly as-is

#### Alternatives:

**`"es2022"`** (ES2022 Standard)
- **What it does**: Compiles to ES2022 features
- **Features included**: 
  - Top-level await
  - Class fields and private methods
  - Array methods (.at(), .findLast())
  - Object.hasOwn()
- **When to use**: 
  - Node.js 18+ projects
  - Want specific feature set
  - More predictable than "esnext"
- **Pros**: Stable, well-defined feature set
- **Cons**: Doesn't include future features

**`"es2021"`** (ES2021 Standard)
- **What it does**: Compiles to ES2021 features
- **Features included**: 
  - Logical assignment operators (||=, &&=, ??=)
  - String.replaceAll()
  - Numeric separators (1_000_000)
- **When to use**: Node.js 16+ projects
- **Pros**: Stable, good compatibility
- **Cons**: Missing newer features

**`"es2020"`** (ES2020 Standard)
- **What it does**: Compiles to ES2020 features
- **Features included**: 
  - Optional chaining (`?.`)
  - Nullish coalescing (`??`)
  - BigInt
  - Dynamic imports
- **When to use**: Node.js 14+ projects
- **Pros**: Good balance of features and compatibility
- **Cons**: Missing newer features

**`"es2019"`, `"es2018"`, `"es2017"`, `"es2016"`, `"es2015"`** (Older Versions)
- **What it does**: Compiles to specific older ES versions
- **When to use**: 
  - Targeting older Node.js versions
  - Need specific feature compatibility
  - Legacy browser support
- **Example**: `"es2015"` (ES6) includes classes, arrow functions, let/const
- **Pros**: Maximum compatibility
- **Cons**: More transpilation, larger output, missing modern features

**`"es5"`** (ES5 - Very Old)
- **What it does**: Compiles to ES5 (2009 standard)
- **When to use**: 
  - Supporting very old browsers (IE11)
  - Legacy systems
  - Maximum compatibility
- **Transpilation**: 
  - Classes → Functions
  - Arrow functions → Regular functions
  - async/await → Promises
  - Template literals → String concatenation
- **Pros**: Works everywhere
- **Cons**: Large output, slow runtime, missing modern features
- **Note**: Rarely needed in 2024

**`"es3"`** (ES3 - Extremely Old)
- **What it does**: Compiles to ES3 (1999 standard)
- **When to use**: Only for extremely legacy systems
- **Rarely used**: Almost never needed

### `types: []`
- **Purpose**: Specifies which type declaration packages to include
- **Value**: Empty array means no automatic type inclusion
- **Functionality**: 
  - By default, TypeScript includes all `@types/*` packages
  - Empty array means you must explicitly import types
  - Reduces compilation time and avoids unwanted types

#### Alternatives:

**`types: []`** (Current - Empty Array)
- **What it does**: No automatic type inclusion
- **When to use**: 
  - Want explicit control
  - Faster compilation
  - Avoid type conflicts
- **Pros**: Fast, explicit, no surprises
- **Cons**: Must manually import types

**`types: ["node"]`** (Explicit List)
- **What it does**: Only includes specified `@types/*` packages
- **Example**: `"types": ["node", "express"]`
- **When to use**: 
  - Know exactly which types you need
  - Want to limit type inclusion
- **Pros**: Controlled, faster than default
- **Cons**: Must list all needed types

**`types: undefined` or omitted** (Default Behavior)
- **What it does**: Automatically includes all `@types/*` packages from node_modules
- **When to use**: 
  - Convenience over performance
  - Don't mind slower compilation
  - Want all types available
- **Pros**: Convenient, no configuration
- **Cons**: Slower compilation, potential conflicts
- **Note**: This is the default if you don't specify `types`

### `lib` (commented)
- **Purpose**: Specifies library files to include in compilation
- **Example**: `"lib": ["esnext"]`
- **Functionality**: 
  - Defines which built-in JavaScript APIs are available
  - Controls what global types and methods TypeScript knows about
  - Defaults based on `target` if not specified

#### Alternatives:

**`lib: ["esnext"]`** (Latest Features)
- **What it does**: Includes all latest ES features
- **When to use**: Modern Node.js projects, want latest APIs
- **Includes**: Latest array methods, Promise features, etc.
- **Pros**: Access to newest features
- **Cons**: May not work in older environments

**`lib: ["es2022"]`** (Specific Version)
- **What it does**: Includes ES2022 standard library
- **When to use**: Want specific, stable feature set
- **Includes**: ES2022 array methods, Object.hasOwn(), etc.
- **Pros**: Stable, predictable
- **Cons**: Missing newer features

**`lib: ["es2020", "dom"]`** (Browser + ES2020)
- **What it does**: Includes ES2020 + browser APIs
- **When to use**: Frontend projects
- **Includes**: 
  - ES2020 features
  - DOM types (Document, Window, HTMLElement, etc.)
  - Web APIs (fetch, localStorage, etc.)
- **Pros**: Full browser support
- **Cons**: Not for Node.js

**`lib: ["esnext", "dom", "dom.iterable"]`** (Full Browser)
- **What it does**: Latest ES + full DOM + iterable DOM
- **When to use**: Modern frontend projects
- **Includes**: Everything browser-related
- **Pros**: Complete browser API support
- **Cons**: Not for backend

**`lib: ["es5"]`** (Legacy)
- **What it does**: Only ES5 features
- **When to use**: Supporting very old browsers
- **Pros**: Maximum compatibility
- **Cons**: Missing modern features

**`lib: []`** (Empty - No Built-ins)
- **What it does**: No built-in types at all
- **When to use**: Custom runtime, embedded systems
- **Pros**: Minimal, custom
- **Cons**: No standard library types

**Omitted** (Default Based on Target)
- **What it does**: TypeScript picks `lib` based on `target`
- **When to use**: Default behavior is usually fine
- **Pros**: Automatic, sensible defaults
- **Cons**: Less control

---

## Other Output Options

### `sourceMap: true`
- **Purpose**: Generates `.map` files for debugging
- **Functionality**: 
  - Maps compiled JavaScript back to original TypeScript
  - Enables debugging TypeScript in browser/dev tools
  - Shows original TS line numbers in stack traces
- **File output**: Creates `app.js.map` alongside `app.js`

#### Alternatives:

**`sourceMap: true`** (Current)
- **What it does**: Generates `.map` files
- **When to use**: Development, debugging needed
- **Pros**: Full debugging support
- **Cons**: Extra files, slightly slower builds

**`sourceMap: false`** (No Source Maps)
- **What it does**: No source map generation
- **When to use**: Production builds where you don't need debugging
- **Pros**: Faster builds, smaller output
- **Cons**: Harder to debug production issues

**`sourceMap: "inline"`** (Inline Source Maps)
- **What it does**: Embeds source map in the JS file (base64)
- **When to use**: Single file deployments, don't want separate files
- **Pros**: No separate files
- **Cons**: Larger JS files, not recommended for production

### `declaration: true`
- **Purpose**: Generates `.d.ts` declaration files
- **Functionality**: 
  - Creates type definition files for your code
  - Allows other projects to use your code with type safety
  - Essential for publishing TypeScript libraries
- **File output**: Creates `app.d.ts` with type definitions

#### Alternatives:

**`declaration: true`** (Current)
- **What it does**: Generates `.d.ts` files
- **When to use**: 
  - Publishing libraries
  - Sharing code between projects
  - Want type definitions available
- **Pros**: Full type support for consumers
- **Cons**: Extra files, slightly slower builds

**`declaration: false`** (No Declarations)
- **What it does**: No `.d.ts` file generation
- **When to use**: 
  - Internal applications (not libraries)
  - Don't need to share types
  - Faster builds
- **Pros**: Faster builds, simpler output
- **Cons**: No type definitions for others

### `declarationMap: true`
- **Purpose**: Generates source maps for declaration files
- **Functionality**: 
  - Maps `.d.ts` files back to original `.ts` source
  - Enables "Go to Definition" to jump to original TS files
  - Useful for library development and IDE navigation

---

## Stricter Typechecking Options

### `noUncheckedIndexedAccess: true`
- **Purpose**: Makes array/object index access safer
- **Functionality**: 
  - `arr[0]` returns `T | undefined` instead of `T`
  - Forces you to check for undefined before using indexed values
  - Prevents runtime errors from accessing non-existent indices
- **Example**:
  ```typescript
  const arr = [1, 2, 3];
  const first = arr[0]; // Type: number | undefined
  if (first !== undefined) {
    console.log(first); // Now TypeScript knows it's number
  }
  ```

### `exactOptionalPropertyTypes: true`
- **Purpose**: Distinguishes between `undefined` and missing properties
- **Functionality**: 
  - `{ prop?: string }` means property can be `string` or missing, but NOT `undefined`
  - `{ prop: string | undefined }` means property must exist but can be `undefined`
  - More precise type checking
- **Example**:
  ```typescript
  interface User {
    name?: string; // Can be missing, but if present must be string
  }
  const user: User = { name: undefined }; // ❌ Error!
  const user2: User = {}; // ✅ OK
  ```

### `noImplicitReturns` (commented)
- **Purpose**: Ensures all code paths return a value
- **Functionality**: 
  - Functions must explicitly return in all branches
  - Prevents forgetting return statements
- **Example**:
  ```typescript
  function getValue(x: number) {
    if (x > 0) return x;
    // ❌ Error: Not all code paths return a value
  }
  ```

### `noImplicitOverride` (commented)
- **Purpose**: Requires `override` keyword when overriding methods
- **Functionality**: 
  - Makes inheritance relationships explicit
  - Prevents accidental method shadowing
- **Example**:
  ```typescript
  class Parent {
    method() {}
  }
  class Child extends Parent {
    override method() {} // Must use 'override'
  }
  ```

### `noUnusedLocals` (commented)
- **Purpose**: Reports errors on unused local variables
- **Functionality**: 
  - Catches dead code
  - Keeps codebase clean
- **Example**:
  ```typescript
  function test() {
    const unused = 5; // ❌ Error: 'unused' is declared but never used
  }
  ```

### `noUnusedParameters` (commented)
- **Purpose**: Reports errors on unused function parameters
- **Functionality**: 
  - Prevents unused parameters (prefix with `_` to ignore)
- **Example**:
  ```typescript
  function handler(_event: Event) {} // ✅ OK with underscore
  function handler(event: Event) {} // ❌ Error if unused
  ```

### `noFallthroughCasesInSwitch` (commented)
- **Purpose**: Prevents fall-through in switch statements
- **Functionality**: 
  - Requires `break` or explicit fall-through comment
  - Prevents accidental bugs
- **Example**:
  ```typescript
  switch (x) {
    case 1:
      doSomething();
      // ❌ Error: Fallthrough case
    case 2:
      break;
  }
  ```

### `noPropertyAccessFromIndexSignature` (commented)
- **Purpose**: Requires bracket notation for index signatures
- **Functionality**: 
  - `obj.prop` not allowed if `prop` might not exist
  - Must use `obj['prop']` for index signatures
  - Safer property access

---

## Recommended Options

### `strict: true`
- **Purpose**: Enables all strict type-checking options
- **Functionality**: 
  - Master switch for strict mode
  - Enables: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`
  - **Best practice**: Always use this in production code

#### What `strict: true` enables:

**`noImplicitAny: true`**
- **What it does**: Error when TypeScript can't infer a type (implicit `any`)
- **Example**:
  ```typescript
  function test(x) { // ❌ Error: Parameter 'x' implicitly has 'any' type
    return x * 2;
  }
  ```
- **Fix**: `function test(x: number) { ... }`

**`strictNullChecks: true`**
- **What it does**: `null` and `undefined` are separate types
- **Example**:
  ```typescript
  let name: string = null; // ❌ Error
  let name: string | null = null; // ✅ OK
  ```

**`strictFunctionTypes: true`**
- **What it does**: Stricter checking of function types
- **Example**: Contravariant parameter checking

**`strictBindCallApply: true`**
- **What it does**: Stricter checking of `bind`, `call`, `apply`
- **Example**: Type checks arguments to these methods

**`strictPropertyInitialization: true`**
- **What it does**: Class properties must be initialized
- **Example**:
  ```typescript
  class User {
    name: string; // ❌ Error: Property must be initialized
  }
  ```

**`noImplicitThis: true`**
- **What it does**: `this` must have explicit type
- **Example**: Functions using `this` must type it

**`alwaysStrict: true`**
- **What it does**: Parses in strict mode, emits "use strict"
- **Example**: JavaScript strict mode enabled

#### Alternatives:

**`strict: true`** (Current - Recommended)
- **Pros**: Maximum type safety, catches many bugs
- **Cons**: More verbose, requires more type annotations
- **Best for**: Production code, new projects

**`strict: false`** (Not Recommended)
- **Pros**: Less strict, easier to start
- **Cons**: Less type safety, more runtime errors
- **Best for**: Only for very specific legacy cases

### `jsx: "react-jsx"`
- **Purpose**: How to handle JSX syntax
- **Value**: `"react-jsx"` (React 17+ new JSX transform)
- **Functionality**: 
  - Compiles JSX to `jsx()` function calls
  - No need to import React in every file
  - Modern React pattern
- **Note**: Not needed for backend projects (can be removed)

#### Alternatives:

**`jsx: "react-jsx"`** (Current - React 17+)
- **What it does**: New JSX transform, uses `jsx()` function
- **When to use**: React 17+ projects
- **Output**: `jsx('div', { children: 'Hello' })`
- **Pros**: 
  - No React import needed
  - Better performance
  - Automatic key handling
- **Cons**: Requires React 17+

**`jsx: "react"`** (Classic React)
- **What it does**: Classic JSX transform, uses `React.createElement()`
- **When to use**: 
  - React 16 and below
  - Legacy projects
  - Need maximum compatibility
- **Output**: `React.createElement('div', null, 'Hello')`
- **Pros**: Works with all React versions
- **Cons**: 
  - Must import React in every file
  - Slightly larger output
  - Older pattern

**`jsx: "preserve"`** (Keep JSX)
- **What it does**: Keeps JSX syntax as-is, doesn't transform
- **When to use**: 
  - Using another tool (Babel) to transform JSX
  - Custom JSX runtime
  - Want to transform JSX separately
- **Output**: JSX stays as JSX in output
- **Pros**: Flexible, use your own transformer
- **Cons**: Output not directly runnable

**`jsx: "react-native"`** (React Native)
- **What it does**: React Native JSX transform
- **When to use**: React Native mobile apps
- **Output**: React Native compatible JSX
- **Pros**: Optimized for React Native
- **Cons**: Only for React Native

**`jsx: undefined` or omitted** (No JSX)
- **What it does**: JSX syntax causes errors
- **When to use**: Backend projects, no JSX needed
- **Pros**: Prevents accidental JSX usage
- **Cons**: Can't use JSX if needed later

### `verbatimModuleSyntax: true`
- **Purpose**: Preserves import/export syntax exactly as written
- **Functionality**: 
  - `import type` stays as type-only import
  - `export type` stays as type-only export
  - Prevents accidental value imports from type-only imports
  - Better tree-shaking and bundler optimization

#### Alternatives:

**`verbatimModuleSyntax: true`** (Current)
- **What it does**: Preserves exact import/export syntax
- **When to use**: 
  - Modern projects
  - Using bundlers (webpack, vite, etc.)
  - Want optimal tree-shaking
- **Pros**: 
  - Better bundler optimization
  - Explicit type-only imports
  - Prevents mistakes
- **Cons**: 
  - Must use `import type` explicitly
  - Slightly more verbose

**`verbatimModuleSyntax: false`** (Flexible)
- **What it does**: TypeScript can optimize imports
- **When to use**: 
  - Don't need strict import syntax
  - Simpler code
  - Not using advanced bundlers
- **Pros**: 
  - More flexible
  - Less verbose
- **Cons**: 
  - Less optimal for bundlers
  - Can accidentally import values from type-only

### `isolatedModules: true`
- **Purpose**: Ensures each file can be transpiled independently
- **Functionality**: 
  - Required for tools like Babel, esbuild, SWC
  - Prevents certain TypeScript features that require multi-file analysis
  - Faster compilation with parallel processing
  - **Best practice**: Always enable for modern tooling

#### Alternatives:

**`isolatedModules: true`** (Current)
- **What it does**: Each file must be independently compilable
- **When to use**: 
  - Using Babel, esbuild, SWC, or other transpilers
  - Want parallel compilation
  - Modern tooling
- **Restrictions**: 
  - Can't use `const enum` (must use regular `enum`)
  - Must have explicit type annotations in some cases
  - Re-exports must be explicit
- **Pros**: 
  - Works with all modern tools
  - Faster parallel builds
  - Better compatibility
- **Cons**: 
  - Some TypeScript features disabled
  - Must be more explicit

**`isolatedModules: false`** (Full TypeScript)
- **What it does**: Allows all TypeScript features, even multi-file ones
- **When to use**: 
  - Only using TypeScript compiler (tsc)
  - Want all TypeScript features
  - Don't need tool compatibility
- **Pros**: 
  - All TypeScript features available
  - Can use `const enum`
  - More flexible
- **Cons**: 
  - Doesn't work with Babel/esbuild/SWC
  - Slower (can't parallelize as well)
  - Less compatible

### `noUncheckedSideEffectImports: true`
- **Purpose**: Requires explicit side-effect imports
- **Functionality**: 
  - `import './styles.css'` must be explicit
  - Prevents accidental side effects
  - Better tree-shaking
  - Forces you to be intentional about imports

#### Alternatives:

**`noUncheckedSideEffectImports: true`** (Current)
- **What it does**: Requires explicit side-effect imports
- **When to use**: 
  - Want to prevent accidental side effects
  - Better tree-shaking
  - More explicit code
- **Example**: Must use `import './styles.css'` explicitly
- **Pros**: 
  - Prevents bugs
  - Better optimization
  - More intentional code
- **Cons**: 
  - Must be explicit about side effects
  - Slightly more verbose

**`noUncheckedSideEffectImports: false`** (Allow Implicit)
- **What it does**: Allows implicit side-effect imports
- **When to use**: 
  - Don't need strict checking
  - Simpler code
  - Legacy projects
- **Pros**: 
  - More flexible
  - Less verbose
- **Cons**: 
  - Can have accidental side effects
  - Less optimal tree-shaking

### `moduleDetection: "force"`
- **Purpose**: How TypeScript detects if a file is a module
- **Value**: `"force"` - Treat all files as modules
- **Functionality**: 
  - Every file is treated as an ES module
  - Prevents global scope pollution
  - Consistent module behavior

#### Alternatives:

**`moduleDetection: "force"`** (Current)
- **What it does**: All files are modules, no global scope
- **When to use**: 
  - Modern projects
  - Want strict module boundaries
  - ES modules only
- **Pros**: 
  - No global scope pollution
  - Consistent behavior
  - Prevents accidental globals
- **Cons**: Can't use global scripts

**`moduleDetection: "auto"`** (Automatic Detection)
- **What it does**: Detects modules based on imports/exports
- **When to use**: 
  - Mixed codebase (some modules, some scripts)
  - Legacy projects
  - Want flexibility
- **Detection**: File is module if it has `import`/`export`
- **Pros**: Flexible, works with mixed code
- **Cons**: Less strict, can have globals

**`moduleDetection: "legacy"`** (Old Behavior)
- **What it does**: Old TypeScript module detection
- **When to use**: 
  - Very old codebases
  - Need backward compatibility
  - Legacy projects
- **Pros**: Compatible with old code
- **Cons**: Less strict, outdated

### `skipLibCheck: true`
- **Purpose**: Skips type checking of declaration files
- **Functionality**: 
  - Faster compilation (doesn't check `node_modules/@types/*`)
  - Assumes library type definitions are correct
  - **Trade-off**: Might miss errors in type definitions
  - **Best practice**: Usually safe to enable for faster builds

#### Alternatives:

**`skipLibCheck: true`** (Current)
- **What it does**: Skips checking `.d.ts` files in node_modules
- **When to use**: 
  - Want faster builds
  - Trust library type definitions
  - Most projects
- **Pros**: 
  - Significantly faster compilation
  - Usually safe (library types are tested)
- **Cons**: 
  - Might miss errors in type definitions
  - Won't catch library type bugs

**`skipLibCheck: false`** (Check Everything)
- **What it does**: Checks all type definition files
- **When to use**: 
  - Want maximum type safety
  - Debugging type issues
  - Don't mind slower builds
- **Pros**: 
  - Catches all type errors
  - More thorough checking
- **Cons**: 
  - Much slower compilation
  - May find errors in library types (not your code)

---

## How It All Works Together

1. **Module System**: `module: "nodenext"` + `target: "esnext"` = Modern Node.js ES modules
2. **Type Safety**: `strict: true` + stricter options = Maximum type safety
3. **Output**: `sourceMap` + `declaration` = Full debugging and library support
4. **Compatibility**: `isolatedModules` + `verbatimModuleSyntax` = Works with modern bundlers
5. **Performance**: `skipLibCheck` + `types: []` = Faster compilation

---

## For Your Backend Project

Since you're building a Node.js backend:
- ✅ `module: "nodenext"` - Perfect for Node.js ES modules
- ✅ `target: "esnext"` - Modern JavaScript features
- ✅ `strict: true` - Type safety
- ⚠️ `jsx: "react-jsx"` - Not needed for backend (can remove)
- ✅ `isolatedModules` - Good for tooling compatibility
- 💡 Consider uncommenting `rootDir` and `outDir` for organized structure

---

## Decision Guide: Choosing Alternatives

### For Node.js Backend Projects (Your Use Case)

```json
{
  "compilerOptions": {
    "module": "nodenext",           // ✅ Best for Node.js ES modules
    "target": "esnext",              // ✅ Modern features
    "lib": ["esnext"],               // ✅ Node.js APIs
    "moduleDetection": "force",      // ✅ All files are modules
    "strict": true,                  // ✅ Type safety
    "isolatedModules": true,         // ✅ Works with modern tools
    "skipLibCheck": true,            // ✅ Faster builds
    "sourceMap": true,               // ✅ Debugging
    "declaration": false,            // ⚠️ Only if not a library
    "jsx": undefined                 // ❌ Remove for backend
  }
}
```

### For Frontend/React Projects

```json
{
  "compilerOptions": {
    "module": "esnext",              // ✅ For bundlers
    "target": "esnext",              // ✅ Modern browsers
    "lib": ["esnext", "dom"],       // ✅ Browser APIs
    "jsx": "react-jsx",             // ✅ React 17+
    "moduleDetection": "force",      // ✅ Modules
    "strict": true,                 // ✅ Type safety
    "isolatedModules": true,         // ✅ Works with bundlers
    "skipLibCheck": true,            // ✅ Faster builds
    "sourceMap": true                // ✅ Debugging
  }
}
```

### For Publishing Libraries

```json
{
  "compilerOptions": {
    "module": "nodenext",           // ✅ Node.js modules
    "target": "es2022",              // ✅ Stable target
    "declaration": true,             // ✅ Must have
    "declarationMap": true,          // ✅ Better IDE support
    "sourceMap": true,               // ✅ Debugging
    "strict": true,                  // ✅ Type safety
    "skipLibCheck": true             // ✅ Faster builds
  }
}
```

### For Legacy/Browser Compatibility

```json
{
  "compilerOptions": {
    "module": "es2015",              // ✅ Older browsers
    "target": "es5",                 // ✅ Maximum compatibility
    "lib": ["es5", "dom"],           // ✅ Basic APIs
    "strict": false,                 // ⚠️ Less strict (not recommended)
    "skipLibCheck": true             // ✅ Faster builds
  }
}
```

## Summary: The 5 Options You Asked About

### Quick Reference Table

| Option | Purpose | When to Use | Default/Recommended |
|--------|---------|-------------|---------------------|
| `esModuleInterop` | CommonJS ↔ ES Module interop | Mixing module systems | `true` (recommended) |
| `moduleResolution` | How to resolve imports | All projects | Auto-detected from `module` |
| `outDir` | Output directory | Organized projects | Omit (outputs next to source) |
| `experimentalDecorators` | Enable decorator syntax | NestJS, Angular, TypeORM | `false` (unless needed) |
| `emitDecoratorMetadata` | Runtime type metadata | Dependency injection | `false` (unless needed) |

### Common Combinations

#### 1. **Modern Node.js Backend (Your Current Setup)**
```json
{
  "module": "nodenext",
  "moduleResolution": "nodenext",  // Auto-detected, can omit
  "esModuleInterop": true,          // ✅ Helpful for npm packages
  "outDir": "dist",                 // ✅ Keep output organized
  "experimentalDecorators": false,   // ❌ Not needed unless using NestJS
  "emitDecoratorMetadata": false    // ❌ Not needed unless using NestJS
}
```

#### 2. **NestJS Backend (With Decorators)**
```json
{
  "module": "nodenext",
  "moduleResolution": "nodenext",
  "esModuleInterop": true,          // ✅ For npm packages
  "outDir": "dist",                 // ✅ Organized output
  "experimentalDecorators": true,    // ✅ Required for NestJS
  "emitDecoratorMetadata": true     // ✅ Required for DI
}
```

#### 3. **React Frontend**
```json
{
  "module": "esnext",
  "moduleResolution": "bundler",    // ✅ For bundlers
  "esModuleInterop": true,          // ✅ For npm packages
  "outDir": "dist",                 // ✅ Build output
  "experimentalDecorators": false,   // ❌ Not typically used
  "emitDecoratorMetadata": false    // ❌ Not typically used
}
```

#### 4. **TypeORM/Angular (Decorators)**
```json
{
  "module": "esnext",
  "moduleResolution": "node",
  "esModuleInterop": true,          // ✅ For npm packages
  "outDir": "dist",                 // ✅ Build output
  "experimentalDecorators": true,    // ✅ Required
  "emitDecoratorMetadata": true     // ✅ Required for DI
}
```

### Important Notes

1. **`esModuleInterop` + `module: "nodenext"`**:
   - With `nodenext`, Node.js handles interop automatically
   - You may not need `esModuleInterop` explicitly
   - But it doesn't hurt to include it

2. **`moduleResolution` Auto-detection**:
   - If you use `module: "nodenext"`, `moduleResolution` defaults to `"nodenext"`
   - You can omit it and TypeScript will choose correctly
   - Explicit is better than implicit (recommend specifying)

3. **Decorators are Experimental**:
   - Still not finalized in JavaScript/TypeScript
   - Only enable if you're using frameworks that require them
   - May change in future TypeScript versions

4. **`emitDecoratorMetadata` Requirements**:
   - Requires `experimentalDecorators: true`
   - Requires `reflect-metadata` package installed
   - Must import `reflect-metadata` at the top of your entry file

5. **`outDir` Best Practice**:
   - Always use this to separate source and compiled code
   - Makes it easy to ignore compiled files in git
   - Keeps project structure clean

## Quick Reference

| Option | Category | Impact | Common Values |
|--------|----------|--------|---------------|
| `module` | Compilation | How code is bundled | `"nodenext"`, `"commonjs"`, `"esnext"` |
| `target` | Compilation | JavaScript version output | `"esnext"`, `"es2022"`, `"es5"` |
| `strict` | Type Safety | Master strict mode switch | `true` (recommended) |
| `isolatedModules` | Compatibility | Works with modern tools | `true` (recommended) |
| `sourceMap` | Debugging | Enables source debugging | `true` (dev), `false` (prod) |
| `declaration` | Library | Creates .d.ts files | `true` (libraries), `false` (apps) |
| `jsx` | JSX | How to handle JSX | `"react-jsx"`, `"react"`, `undefined` |
| `skipLibCheck` | Performance | Skip checking lib types | `true` (recommended) |

## Common Patterns

### Pattern 1: Modern Node.js Backend
- `module: "nodenext"` + `target: "esnext"` + `strict: true`
- Best for: New Node.js projects, ES modules

### Pattern 2: React Frontend
- `module: "esnext"` + `jsx: "react-jsx"` + `lib: ["dom"]`
- Best for: React applications, modern browsers

### Pattern 3: Library Development
- `declaration: true` + `declarationMap: true` + `sourceMap: true`
- Best for: Publishing npm packages

### Pattern 4: Maximum Compatibility
- `target: "es5"` + `module: "commonjs"` + `lib: ["es5"]`
- Best for: Supporting old browsers/systems

### Pattern 5: Fast Development
- `skipLibCheck: true` + `types: []` + `sourceMap: true`
- Best for: Quick iteration, development builds
