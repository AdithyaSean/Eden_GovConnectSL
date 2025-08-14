# TASKS (Next Prototype Iteration – Implementation Sprint 2)

Goal: Build on Sprint 1 stubs. Persist `agentRuns` and `auditLogs` to Firestore from the demo form submission. Integrate the checkpoint admin panel with live data from the simulated automation store. Refine the admin UI for managing applications and users.

Sprint 1 Stubs Completed (Reference):
- `src/lib/service-schemas/passport-renewal.ts` (User A)
- `src/components/dynamic-form.tsx` (User A)
- `src/app/services/passport-renewal/demo/page.tsx` (User A)
- `src/lib/automation/prompt-builder.ts` (User B)
- `src/lib/prompts/registry.ts` (User C)
- `firestore.rules` (User D)
- `src/lib/security/validators.ts` (User D)
- `src/app/admin/checkpoints/page.tsx` (User E)
- `src/components/checkpoint-table.tsx` (User E)

---

## User A – Persist AgentRun to Firestore
Deliverables:
1.  Modify the `onSubmit` handler in `src/app/services/passport-renewal/demo/page.tsx`.
2.  After the `/api/automation/runs` call succeeds, create a new document in the `agentRuns` collection in Firestore.
3.  The document should store the `runId`, `serviceSlug`, `status`, `createdAt`, and the `values` from the form.
4.  Create a corresponding `auditLogs` entry for the `AgentRunStart` event.
Verification:
- Submitting the passport renewal form creates a new document in the `agentRuns` collection in Firestore.

## User B – Refine Admin Application Management
Deliverables:
1.  In `src/app/admin/applications/page.tsx`, enhance the filtering capabilities. Add a date range filter for the 'Submitted' date.
2.  In `src/app/admin/applications/[id]/page.tsx`, display the `details` object from the application document in a readable format within a new Card component if it exists.
Verification:
- Admin can filter applications by a date range.
- Viewing an application shows all submitted form data from the `details` field.

## User C – Internationalization (i18n) Scaffolding
Deliverables:
1.  Add `next-intl` to `package.json`.
2.  Create a `src/messages` directory with `en.json`. Add a sample message for the dashboard title.
3.  Update `src/app/layout.tsx` and create a new `src/app/[locale]` directory to handle routing.
4.  Update the `middleware.ts` to handle locale detection and redirection.
Verification:
- The app runs under `/en/dashboard` and displays the title from the JSON message file.

## User D – Live Checkpoint Integration
Deliverables:
1.  Update `src/components/checkpoint-table.tsx` to fetch live checkpoint data from `/api/automation/checkpoints` instead of using a static array.
2.  The "Resolve" button should now make a POST request to `/api/automation/callback` with the correct `runId` and `checkpointId`.
3.  After successfully resolving a checkpoint, the table should auto-refresh and the resolved item should disappear.
Verification:
- The admin checkpoint page at `/admin/checkpoints` displays real pending checkpoints from the simulation and can resolve them.

## User E – User Profile Page Enhancements
Deliverables:
1.  In `src/app/profile/page.tsx`, allow the user to update their contact number.
2.  Add a new tab for "Communication Preferences" where a user can toggle receiving email or SMS notifications (UI only, no backend logic).
3.  Display a list of recent login activity (mock data is fine) in a new "Security" tab.
Verification:
- User can see and edit their contact number.
- New tabs and fields are visible on the profile page.

---
Shared Non-Functional Requirements:
- All new components should be responsive.
- Use shadcn/ui components where appropriate.
- Ensure new database interactions are secure and efficient.

Out of Scope This Sprint:
- Full i18n implementation across the entire app.
- Real-time updates for the admin dashboard stats.
- Role-based access control enforcement in the UI.

Submission Guidelines:
- Update `CHANGELOG.md` with a new entry for Sprint 2 deliverables.
- Reference the originating task in PRs (e.g., "Completes User A task for Sprint 2").
