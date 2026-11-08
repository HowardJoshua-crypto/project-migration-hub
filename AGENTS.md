<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Portal routes live under `/app/talent`, `/app/org/$orgId`, `/app/org/$orgId/partner`, `/app/admin`; one shared AppShell driven by a nav config per area, so new areas plug in without new layouts.
- Screens read and write data only through `src/services/*` (TanStack Query options + async functions); fixtures live only in `src/mocks/`, so the backend phase swaps service bodies without touching screens.
- Until a real backend exists, services persist to the browser test-data store in `src/services/store.ts`; every screen backed by it shows `TestDataBadge`, and read-only sample screens show `MockBadge`, so nobody mistakes browser-only data for saved records.
- Business rules (statuses, matching, privacy, publishing, validation) live as pure functions in `src/domain/` and are re-checked inside services, so forms can't bypass them and tests cover them in `src/test/`.
