# Инструменты генерации под текущий стек (wayfinder #12)

Design First: **TypeSpec → OpenAPI → SDK**. TypeSpec is the single source of truth; OpenAPI is the interchange hub consumed by two generators (TS client, Kotlin/Spring server). Microsoft ships client emitters (`@typespec/http-client-js`, `-java`, `-csharp`, `-python`) and server emitters for JS/C#/Java, but **there is no Kotlin server emitter** — so Kotlin must come from OpenAPI via OpenAPI Generator.

## 1. Recommended toolchain

| Role | Package | Version (verified 2026) |
| --- | --- | --- |
| TypeSpec language core | `@typespec/compiler` | ~1.17.0 |
| REST protocol lib | `@typespec/http` | same minor as compiler |
| OpenAPI emitter | `@typespec/openapi3` | same minor as compiler |
| TS client generator | `@openapitools/openapi-generator-cli` (`typescript-fetch`) | 2.41.0 (wraps generator 7.25.0) |
| Kotlin server generator | same CLI (`kotlin-spring`) | 7.25.0 |

Pin all `@typespec/*` to one version — they are tested together only at the `typespec-stable@` tag. `@typespec/openapi3` needs **Node ≥ 22**. The CLI is a JVM wrapper; JDK 21 already present satisfies it.

## 2. Single command

Add a `spec/` package at repo root holding `main.tsp`, `tspconfig.yaml`, and these scripts:

```jsonc
"generate:openapi": "tsp compile .",
"generate:client":  "openapi-generator-cli generate -i tsp-output/openapi/openapi.yaml -g typescript-fetch -o ../../frontend/src/generated/api --additional-properties=supportsES6=true",
"generate:server":  "openapi-generator-cli generate -i tsp-output/openapi/openapi.yaml -g kotlin-spring -o ../../backend/build/generated/openapi --additional-properties=interfaceOnly=true,useSpringBoot4=true,useJackson3=true,apiPackage=com.example.api,modelPackage=com.example.api.model",
"generate": "npm run generate:openapi && npm run generate:client && npm run generate:server"
```

`tspconfig.yaml` sends OpenAPI to a known path:

```yaml
emit: ["@typespec/openapi3"]
options:
  "@typespec/openapi3":
    emitter-output-dir: "{project-root}/tsp-output/openapi"
```

One command: **`npm run generate`** in `spec/` (root `make generate` wrapper optional). `useSpringBoot4`/`useJackson3` match this repo (Spring Boot 4.1, `tools.jackson`).

## 3. What gets generated

- **TypeScript client (`typescript-fetch`)**: model interfaces + enums, `apis/*Api.ts` classes (one method per operation), a runtime (`runtime.ts`) with fetch/`BaseAPI`, serialization helpers, `index.ts` barrel. Dependency-free — fits React 19 + Vite. Output is a package (`npmName`/`npmVersion` options) or plain source.
- **Kotlin server (`kotlin-spring`, `interfaceOnly=true`)**: `Api` interfaces with `@RequestMapping`/`@Valid` stubs (no controllers), model data classes with Jackson 3 annotations, enums, and `ApiUtil.kt`. `interfaceOnly` omits `pom.xml`/`Application.kt`, so it drops into the existing Gradle app; you implement the interfaces as `@RestController`s.

## 4. Keeping generated files untouchable

- Never write generated code into hand-edited dirs. TS → `frontend/src/generated/`; Kotlin → `backend/build/generated/openapi/` (register via `sourceSets["main"].kotlin.srcDir(...)`).
- **Gitignore both** (`tsp-output/`, `frontend/src/generated/`, `backend/build/generated/`); regenerate in CI before lint/build. This guarantees no hand edits.
- Add `frontend/src/generated/**` to `eslint.config.js` ignores and `tsconfig` exclude; the generator writes a `.openapi-generator/FILES` manifest and `@generated` markers as a secondary guard.
- If committed instead, add `.gitattributes` `linguist-generated=true` and a "DO NOT EDIT" header.

## 5. Alternatives rejected

- **OpenAPI Generator Gradle plugin only** — splits generation across two build systems; no single command.
- **Hand-written OpenAPI** — loses compile-time validation and the single source of truth.
- **springdoc-openapi** — reverse direction (annotations → spec); not design-first.
- **`@typespec/http-client-js`** — emits a TS client directly, but has no Kotlin emitter, forcing a second pipeline; keep OpenAPI as the hub.
- **`@hey-api/openapi-ts`** — fine TS-client alternative, but still no Kotlin; `typescript-fetch` already covers both via one CLI.
- **Microsoft server emitters (js/csharp/java)** — no Kotlin target.
- **gRPC/protobuf** — not REST; overkill for this app.
