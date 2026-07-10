# StatusForge Maintainability Rules

Use this as the project checklist before adding features, refactoring, or
committing behavior changes. These rules are meant to keep the codebase easy to
scale as later roadmap versions add more endpoints, workers, real-time flows,
and integrations.

## 1. Keep The Roadmap As The Boundary

- Read `ROADMAP.md` and the active version file before planning work.
- Do not pull future-version features forward unless current-version correctness
  or UX requires it.
- If a future-version concern is deferred, do not treat it as a current defect.
- When a cleanup decision is made, record it in the active roadmap file so the
  decision does not live only in chat.

Why: this prevents scope creep and keeps refactors from turning into hidden
feature work.

Example:

```text
Current version: V6 analytics dashboard

Good:
- Fix response contracts used by V6 dashboard hooks.
- Document that cursor pagination is deferred.

Bad:
- Add API keys while refactoring dashboard endpoints because V10 will need them.
- Report missing SSRF protection as a V6 defect when it is tracked for V10.
```

## 2. Use Feature-First Backend Modules

Backend feature code should live near the feature it belongs to:

```text
src/modules/<feature>/
  controllers/
  routes/
  services/
  validations/
  <feature>.routes.ts
```

Shared code belongs in `src/shared/*` only when more than one feature actually
uses it. Do not move code into shared folders just because it might be reused
later.

Why: later features become easier to add because each module has a predictable
place for its API, business logic, and validation.

Example:

```text
Good:
src/modules/incidents/controllers/addIncidents.controllers.ts
src/modules/incidents/services/addIncidentsData.services.ts
src/modules/incidents/validations/incidentAddValidation.ts
src/modules/incidents/routes/Incidents.routes.ts

Bad:
src/controllers/addIncidents.controllers.ts
src/services/addIncidentsData.services.ts
src/validators/incidentAddValidation.ts
```

If a helper is used only by incidents, keep it inside `modules/incidents`. Move
it to `shared` only after another module actually uses it.

## 3. Routes Are Nouns, Methods Are Verbs

Prefer:

```text
POST   /monitors
GET    /monitors
PATCH  /monitors/:monitorId
DELETE /monitors/:monitorId
POST   /monitors/:monitorId/checks
POST   /incidents/:incidentId/updates
```

Avoid:

```text
/url/register
/:id/delete
/:id/update
/:id/insert
```

Route parameter names must match what controllers read, for example
`:monitorId` with `req.params.monitorId`.

Why: noun routes make the API easier to discover and reduce controller/route
parameter mismatches.

Example:

```ts
// Good
router.post("/:incidentId/updates", authMiddleware, addIncidentData);

export const addIncidentData = (req, res, next) => {
  const incidentId = req.params.incidentId;
};

// Bad
router.post("/:id/insert", authMiddleware, addIncidentData);

export const addIncidentData = (req, res, next) => {
  const incidentId = req.params.incidentId; // undefined
};
```

## 4. Controllers Should Stay Thin

Controllers should only:

- read request data;
- validate input;
- check authentication/ownership basics;
- call one service operation;
- return the HTTP response;
- pass failures to `next(err)`.

Business rules, SQL, queues, Redis, and email-provider calls belong in services,
workers, or dedicated infrastructure modules.

Why: thin controllers are easier to test and less likely to mix HTTP concerns
with business logic.

Example:

```ts
// Good controller
export const registerUrl = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const parsed = urlSchema.parse(req.body);
    const monitor = await registerMonitor(parsed, userId);

    return res.status(201).json({ data: monitor });
  } catch (err) {
    return next(err);
  }
};

// Bad controller
export const registerUrl = async (req, res) => {
  const result = await db.query("INSERT INTO monitor ...");
  await addToQueue(...);
  await resend.emails.send(...);
  return res.json(result.rows[0]);
};
```

## 5. One Success Response Contract

Use one shape consistently:

```ts
// single resource or action result
{ data: value }

// list result
{ data: rows, pagination: { page, limit, totalPage } }

// successful action with no useful body
204 No Content
```

Do not return raw rows from one endpoint and `{ data }` from another. Do not put
business payloads under `message` unless the data itself is a message object:

```ts
{ data: { message: "Verification email sent" } }
```

Why: frontend hooks can unwrap responses predictably and later metadata can be
added without changing every consumer.

Example:

```ts
// Good single response
return res.status(200).json({
  data: {
    id: monitor.id,
    url: monitor.url,
  },
});

// Good list response
return res.status(200).json({
  data: monitors,
  pagination: {
    page,
    limit,
    totalPage,
  },
});

// Bad mixed response
return res.status(200).json(monitors);
return res.status(200).json({ message: monitor });
```

## 6. One Error Response Boundary

Controllers and auth middleware should not write failure responses directly.
They should throw or pass `AppError`/`ZodError` into the shared error middleware.

Use:

```ts
throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
return next(err);
```

Avoid:

```ts
return res.status(401).json({ message: "Unauthorized" });
```

Expected error shape:

```ts
{
  message: string,
  code?: string,
  errors?: Record<string, string>
}
```

Why: one error boundary keeps frontend error handling stable and prevents
slightly different 401/400/500 responses across modules.

Example:

```ts
// Good
if (!monitor) {
  throw new AppError(404, "Monitor not found", "MONITOR_NOT_FOUND");
}

try {
  await service();
} catch (err) {
  return next(err);
}

// Bad
if (!monitor) {
  return res.status(404).json({ error: "No monitor" });
}

catch (err) {
  return res.status(500).json({ message: err.message });
}
```

## 7. Always Use Parsed Validation Data

When using Zod, pass `schema.parse()` output into services:

```ts
const parsed = schema.parse(req.body);
await service(parsed.email, parsed.password);
```

Do not parse input and then keep using `req.body`, because transforms like
`.trim()` and type coercion will be ignored.

Let `ZodError` reach the shared error middleware unless an endpoint has a strong
reason to map it differently.

Why: validation should change the data that enters the system, not only check
that the original input looked valid.

Example:

```ts
const monitorSchema = z.object({
  urlName: z.string().trim().min(1),
  intervalSeconds: z.coerce.number().min(60),
});

// Good: service receives trimmed/coerced data
const parsed = monitorSchema.parse(req.body);
await createMonitor(parsed.urlName, parsed.intervalSeconds);

// Bad: parse runs, but raw values are still used
monitorSchema.parse(req.body);
await createMonitor(req.body.urlName, req.body.intervalSeconds);
```

## 8. Keep Naming Consistent Across Layers

Use one name for one concept across route, controller, service, database, and
frontend types.

Examples:

- `monitorId`, not sometimes `id`, `urlId`, and `monitor_id` in API code.
- `type` for `incident_updates.type`, not `status` in backend payloads.
- `isActive` in API responses when frontend expects camelCase.

Database columns can stay snake_case, but map them once at the service boundary
before returning API data.

Why: inconsistent names create bugs during refactors because TypeScript cannot
always catch semantic mismatches.

Example:

```ts
// Good route/controller naming
router.patch("/:monitorId", updateMonitor);
const monitorId = req.params.monitorId;

// Good database-to-API mapping
return {
  id: row.id,
  urlName: row.url_name,
  isActive: row.is_active,
};

// Bad
router.patch("/:id", updateMonitor);
const monitorId = req.params.monitorId;

return {
  url_name: row.url_name,
  is_active: row.is_active,
};
```

## 9. Separate App Code From Tooling Code

Application TypeScript and migration TypeScript can have different compiler
needs. Keep migration config separate when needed:

```text
apps/backend/tsconfig.json
apps/backend/tsconfig.migrations.json
apps/backend/migrations/
```

Why: the app compiler should not fail because a tooling dependency uses a
different module format or declaration style.

Example:

```json
// apps/backend/tsconfig.json
{
  "include": ["src/**/*"]
}

// apps/backend/tsconfig.migrations.json
{
  "include": ["migrations/**/*"]
}
```

Good:

```bash
node-pg-migrate up -m migrations
tsc --noEmit -p tsconfig.migrations.json
```

Bad:

```text
Keep migrations inside src and let app typecheck fail because migration tooling
types do not match the app module settings.
```

## 10. Frontend Hooks Hide API Shape From Components

Components should mostly receive domain data, not raw HTTP envelopes. Unwrap API
responses inside hooks:

```ts
apiFetch<ApiDataResponse<DashboardOverview>>("/dashboard/overview")
  .then((res) => res.data);
```

Keep list hooks returning list envelopes when components need pagination:

```ts
{ data, pagination }
```

Why: when the API contract changes, fewer components need edits.

Example:

```ts
// Good hook: component receives dashboard fields directly
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: () =>
      apiFetch<ApiDataResponse<DashboardOverview>>("/dashboard/overview").then(
        (res) => res.data,
      ),
  });
};

// Bad component: HTTP envelope leaks into UI everywhere
const upCount = data?.data?.up_count;
const downCount = data?.data?.down_count;
```

## 11. Server State And Client State Are Different

- TanStack Query is for server state: fetched data, loading, errors, refetching,
  cache invalidation.
- Local `useState` is for state owned by one component.
- Zustand is only for shared client UI state that multiple distant components
  need, such as selected rows or bulk-action state.

Why: mixing these responsibilities makes cache invalidation and UI updates
harder to reason about.

Example:

```ts
// Good: server state in TanStack Query
const monitors = useQuery({
  queryKey: ["monitors", page],
  queryFn: () => apiFetch(`/monitors?page=${page}`),
});

// Good: local UI state in component state
const [isModalOpen, setIsModalOpen] = useState(false);

// Good future Zustand use case
const selectedMonitorIds = useBulkSelectionStore((state) => state.selectedIds);

// Bad: storing fetched monitor rows in Zustand and manually syncing them with
// server mutations that TanStack Query should own.
```

## 12. Logging And Observability

- Use the project logger for backend operational logs.
- Do not leave raw backend `console.log`.
- Log useful context, not secrets.
- Keep user-facing errors generic for 500s, but log the internal error.

Why: production debugging needs context, while users should not receive internal
details.

Example:

```ts
// Good
logger.error(
  { err, userId, monitorId },
  "manual monitor check failed",
);

throw new AppError(500, "Manual check failed", "MANUAL_CHECK_FAILED");

// Bad
console.log(err);
return res.status(500).json({
  message: err.stack,
});
```

## 13. Refactor In Small Verified Steps

For behavior-preserving refactors:

1. Move files.
2. Fix imports.
3. Run typecheck.
4. Change routes/contracts if needed.
5. Update frontend consumers.
6. Run typecheck/build/lint.
7. Update docs.

Do not combine a large refactor with unrelated feature work.

Why: when something breaks, small steps make the cause traceable.

Example:

```text
Good refactor sequence:
1. Move auth files into modules/auth.
2. Fix imports.
3. Typecheck.
4. Change `/user/login` to `/auth/login`.
5. Update frontend login hook.
6. Typecheck again.

Bad refactor sequence:
Move folders, rename routes, change response contracts, add a new feature, and
then debug all failures together.
```

## 14. Verification Before Commit

Run the focused checks that match what changed:

```bash
apps/backend/node_modules/.bin/tsc --noEmit -p apps/backend/tsconfig.json --pretty false
apps/backend/node_modules/.bin/tsc --noEmit -p apps/backend/tsconfig.migrations.json --pretty false
apps/frontend/node_modules/.bin/tsc --noEmit -p apps/frontend/tsconfig.json --pretty false
cd apps/backend && node_modules/.bin/tsup src/index.ts --format cjs --dts --out-dir dist
cd apps/frontend && node_modules/.bin/eslint
```

For endpoint behavior changes, also test the happy path and one failure path in
Bruno or another API client.

Why: TypeScript catches wiring problems, but API clients catch contract mistakes
and cookie/auth behavior.

Example:

```text
If you change POST /auth/login:

Automated checks:
- backend typecheck
- frontend typecheck

Manual Bruno checks:
- valid login sets cookies and returns { data: { message } }
- invalid login returns 401 with { message, code }
- /auth/me works after login
```

## 15. Pre-Commit Checklist

- [ ] Did the change stay inside the active roadmap scope?
- [ ] Are routes noun-based and parameters named consistently?
- [ ] Do success responses follow `{ data }` or `{ data, pagination }`?
- [ ] Do errors go through the shared error middleware?
- [ ] Are Zod parsed values used instead of raw request data?
- [ ] Did frontend hooks unwrap API envelopes where appropriate?
- [ ] Are raw backend `console.log` calls absent?
- [ ] Did backend app typecheck pass?
- [ ] Did migration typecheck pass if migrations changed?
- [ ] Did frontend typecheck pass if frontend API consumers changed?
- [ ] Did docs/roadmap notes change if a convention or scope decision changed?

Example commit self-review:

```text
Change: standardized monitor detail responses.

Checklist result:
- Route unchanged: GET /monitors/:monitorId/info.
- Success response now { data }.
- Hook unwraps ApiDataResponse<IndividualOverviewStatsProps>.
- Component still receives IndividualOverviewStatsProps.
- Backend and frontend typechecks pass.
```
