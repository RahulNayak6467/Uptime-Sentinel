# V7 Cleanup

> Supporting cleanup for [V7 — Custom Rules and Extended Check Types](v7.md).

## Frontend monitor-name alignment

- [ ] Rename remaining frontend data properties from `url_name` to
  `monitor_name` in the monitor stats table columns, mock data, table rendering,
  and Overview types.
- [ ] Update the frontend API mapping that currently converts `urlName` into
  `url_name`.
- [ ] Verify the affected monitor table renders the monitor name correctly and
  add or update focused tests for the renamed property.

Database migration-history references to `url_name` are intentionally excluded;
they must retain the historical column name for correct migration ordering and
rollback behavior.
