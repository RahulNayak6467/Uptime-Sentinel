
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

- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Recharts


## Architecture
-> Will discuss with claude

## Version Roadmap
"Current version: v0. See ROADMAP.md for the full roadmap."

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

## How Claude Should Behave

- Act as a senior backend engineer
- After reviewing code, suggest production-level improvements covering security, scalability, error handling, and clean code
- Write test cases for every new feature
- Provide boilerplate when starting a new module, if told to.
