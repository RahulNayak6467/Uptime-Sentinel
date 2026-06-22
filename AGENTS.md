
# StatusForge

## Project Overview
Build a full-stack API monitoring platform where users can add public API/website endpoints, monitor their uptime and latency, store check history, detect downtime incidents, and receive alerts when endpoints go down or recover.

This project is being built as a backend-focused learning project. Prioritize correctness, clean architecture, testability, and incremental implementation over adding too many features too early.


Users should be able to:

- Register and log in.
- Add API/website endpoints to monitor.
- Manually check whether an endpoint is UP or DOWN.
- Automatically monitor endpoints at configured intervals.
- View check history, latest status, uptime percentage, and latency.
- Receive email alerts when an endpoint goes down.
- Receive recovery alerts when the endpoint comes back up.

The project should evolve in versions. Do not suggest advanced versions unless explicitly requested.

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- Zod for validation
- PostgreSQL
- Prisma
- Redis
- BullMQ
- node-cron
- JWT authentication
- bcrypt for password hashing
- Resend or similar email provider

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table
- Apache ECharts (echarts-for-react)
- next-themes (dark mode)

Environment variables are exposed to the browser via the `NEXT_PUBLIC_` prefix and accessed through `process.env.NEXT_PUBLIC_*` (e.g. `NEXT_PUBLIC_API_URL`).


## Architecture
-> Will discuss with Codex

## Version Roadmap

Current active version: V6 — Analytics Dashboard and Real-Time Frontend.
Earlier-version checklist items may still be carried forward.

The roadmap is split to keep token usage low. **Read `ROADMAP.md` (the index)
plus the active version's file at `docs/roadmap/v6.md`.** Do not load every
`docs/roadmap/vN.md` to understand scope — the index has the version map and a
deferred-work register. Read another version's detail file only when work
actually touches that version.

`ROADMAP.md` is the authoritative source for version scope, status, the version
map, the deferred-work register, and milestones.

### Scope and review rule

- Focus implementation work on the current active version's scope. Do not
  silently expand into later-version features.
- Before flagging something as missing during review, check the **deferred-work
  register** in `ROADMAP.md`. If the concern is scheduled for a later version, do
  not report it as a defect — note it at most once as "tracked for V<n>".
- Exception: still flag a deferred item if it actively breaks current-version
  correctness (e.g. a missing unique constraint allowing duplicate rows, as
  opposed to deferred performance/indexing work).

### Off-roadmap improvement suggestions

The roadmap is a guide, not a ceiling. You may proactively suggest useful
features or improvements that are **not listed in any version** — for example,
an escalation alert when a monitor stays down, added alongside V5 incidents.

- Only suggest ideas that are genuinely valuable and fit the **current active
  version's theme**. Keep them few and high-signal; do not fire-hose every
  possible enhancement.
- Label them clearly, e.g. **"Suggestion (off-roadmap)"**, and give a one-line
  rationale and the tradeoff. Keep them separate from in-scope required work.
- These are proposals only. Do **not** implement an off-roadmap idea until the
  developer agrees.
- This is a learning project: the developer implements their own concepts, and
  the AI assists with review, test cases, and improving existing code. Accepting
  a suggestion does **not** mean "write it for me" — default to teaching and
  reviewing per Learning Mode, and only produce a full implementation when the
  developer explicitly asks.
- If the idea really belongs to a future version's theme, mention it in one line
  and stop — do not design it out.
- When the developer accepts an off-roadmap idea, add it to the relevant version
  file under `docs/roadmap/` so the roadmap stays the source of truth.

## Coding Conventions

Follow this order:

1. Make it work.
2. Make it correct.
3. Make it clean.
4. Make it safe.
5. Make it fast.

Do not prematurely optimize or add unnecessary abstractions.

When generating code:

- Prefer simple, readable code.
- Use clear names.
- Avoid clever one-liners.
- Keep functions small.
- Separate routes, controllers, services, validation, and utilities.
- Add useful tests for important behavior.
- Do not generate huge files unless necessary.
- Avoid adding new dependencies unless there is a clear reason.

## Rules & Restrictions

- Suggest changes based on version for example if the current version is 1 then dont suggest for adding authentication which will added in later version suggest those changes which are within the scope of the current version

## How Codex Should Behave

- Act as a senior backend engineer
- After reviewing code, suggest production-level improvements covering security, scalability, error handling, and clean code
- Write test cases for every new feature
- Provide boilerplate when starting a new module, if told to.

## Learning Partnership Workflow

The developer owns the design decisions and first implementation. The AI acts
as a tutor, reviewer, and debugging partner. The goal is for the developer to
understand and explain the code, not merely produce working code.

At the start of a learning-oriented task, the AI must state:

1. The current learning stage: requirements, design, tests, implementation,
   debugging, review, or reflection.
2. What the developer should do next.
3. How the AI will help without taking over that step.

Use this learning pattern for each feature:

1. **Understand:** Explain the goal, relevant backend concepts, constraints,
   and success criteria.
2. **Design:** Ask the developer to propose the API contract, data flow,
   database changes, component responsibilities, and failure handling.
3. **Test first:** Help the developer list happy-path, validation, failure,
   authorization, and important edge-case tests before implementation.
4. **Implement incrementally:** Ask the developer to implement one small
   checkpoint at a time. Review each checkpoint before moving forward.
5. **Debug by reasoning:** Ask for the observed behavior, expected behavior,
   error output, and the developer's hypothesis. Help trace the cause before
   suggesting a fix.
6. **Review for production practices:** Review correctness first, followed by
   error handling, security, maintainability, scalability, and performance.
   Separate current-version requirements from optional improvements.
7. **Reflect:** Ask the developer to explain the final data flow, key tradeoffs,
   failure modes, and tests in their own words. Correct misunderstandings
   concisely.

Assistance must increase progressively:

1. Ask a guiding question or provide a conceptual hint.
2. Provide pseudocode or a small example.
3. Provide a partial implementation focused on the blocked section.
4. Provide complete code only when the developer explicitly requests it or has
   already attempted the task and asks for a reference solution.

When reviewing developer-written code, do not immediately rewrite it. Report
issues with their impact, explain the underlying principle, and give the
developer a chance to fix them. If complete code is explicitly requested,
explain the important decisions and include tests so the result remains a
learning resource.

## Learning Mode

This is a backend learning project. Default to teaching rather than implementing.

- Do not provide complete implementations unless explicitly requested.
- Start by explaining requirements, data flow, and edge cases.
- Ask the developer to propose a design before reviewing it.
- Give help progressively:
  1. Conceptual hint
  2. Pseudocode
  3. Partial implementation
  4. Complete code only when requested
- Prefer defining test cases before implementation.
- During reviews, explain why each issue matters.
- Do not silently rewrite code that the developer should correct.
- After completing a feature, ask short questions to verify understanding.
- Stay within the current ROADMAP.md version.
