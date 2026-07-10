# V6 Learning Notes

Focused notes from the V6/post-V6 refactor work. These are not roadmap tasks;
they are lessons about how the backend should be structured, built, and checked.

---

## Migration files vs app TypeScript build

### What was the problem?

Migration files were originally inside:

```text
apps/backend/src/db/migrations/
```

Because `tsconfig.json` included all of `src/**/*`, the normal backend app
typecheck also typechecked migration files. That mixed two different concerns:

- the Express API server code;
- the database migration tool code.

The compiler then failed on `node-pg-migrate` imports:

```text
Cannot find module 'node-pg-migrate' or its corresponding type declarations
```

The package did have types installed, but the backend app config used:

```json
"moduleResolution": "node10"
```

That resolver is old and could not resolve the package's modern type/export
layout correctly.

### What was the important lesson?

The server app build should not be responsible for compiling migration scripts.
Migrations are run by a separate CLI/tool during database setup or deployment.

In a real backend, this is usually separated:

```text
src/          app/runtime code
migrations/   database migration files
```

The API server imports `src/db/index.ts`, not migration files.

### What changed?

Migrations were moved out of `src`:

```text
apps/backend/migrations/
```

The main backend `tsconfig.json` still includes only:

```json
"include": ["src/**/*"]
```

So app typechecking no longer includes migrations.

Migration scripts in `package.json` were updated from:

```json
"migrate": "node-pg-migrate up -m src/db/migrations"
```

to:

```json
"migrate": "node-pg-migrate up -m migrations"
```

The same folder change was applied to `migrate:down` and `migrate:create`.

### Why add a separate migration tsconfig?

We still want migration files to be typecheckable, just not as part of the app
build. So a separate config was added:

```text
apps/backend/tsconfig.migrations.json
```

It uses:

```json
{
  "module": "ESNext",
  "moduleResolution": "bundler",
  "include": ["migrations/**/*"]
}
```

This lets TypeScript resolve `node-pg-migrate` types without changing the whole
backend app to modern Node module semantics.

### Why not change the main app to `Node16`?

Changing the main backend config to:

```json
"module": "Node16",
"moduleResolution": "node16"
```

could also help resolve modern package types, but it changes module behavior for
the entire backend. That can create unrelated ESM/CommonJS issues across app
code.

For this refactor, the safer design is:

- app config stays focused on runtime server code;
- migration config handles migration scripts separately.

### Extra issue found

One generated migration had untyped parameters:

```ts
export const up = (pgm) => {};
```

With `strict: true`, TypeScript reports:

```text
Parameter 'pgm' implicitly has an 'any' type
```

The fix was to type it explicitly:

```ts
import type { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {};
export const down = (pgm: MigrationBuilder): void => {};
```

### Final mental model

Do not treat every TypeScript file in the repo as one runtime application.

Separate configs are useful when different file groups have different runtime
rules:

- API server: Express runtime, bundled by `tsup`.
- Migrations: migration CLI runtime, run by `node-pg-migrate`.
- Tests: test runner runtime, often with its own globals and setup.

Each can have its own typecheck command when needed.

### Verification after the change

These checks passed:

```bash
apps/backend/node_modules/.bin/tsc --noEmit -p apps/backend/tsconfig.migrations.json
cd apps/backend && node_modules/.bin/tsup src/index.ts --format cjs --dts --out-dir dist
```

The normal app typecheck still has unrelated strict TypeScript errors:

- pagination helper return type can be `undefined`;
- caught errors are `unknown`;
- standard `Error` does not have a `code` property.

Those are separate app-code type-safety issues, not migration configuration
issues.
