
# TASKS (Next Prototype Iteration – Implementation Sprint 3)

Goal: Implement the core internationalization (i18n) framework using `next-intl` and refine data models and flows to support multiple languages. Enhance the AI chat flow to be language-aware. Introduce Firestore security rules for basic data protection.

Sprint 2 Stubs Completed (Reference):
- AgentRun and AuditLog persistence in Firestore.
- Admin application management UI refined with date filters and details view.
- `next-intl` package added and initial configuration scaffolded.
- Checkpoint Admin table now fetches and resolves live (simulated) data.
- User Profile page enhanced with contact update and preference tabs.

---

## User A – Implement i18n in UI Components
Deliverables:
1.  Using the `en.json` file created in Sprint 2, internationalize the main dashboard at `src/app/[locale]/dashboard/page.tsx`.
2.  Extract static text from the dashboard's `Card` titles (e.g., "My Digital Documents") and `ServiceCard` titles into `en.json`.
3.  Use the `useTranslations` hook from `next-intl` to display the localized strings.
4.  Add a sample `si.json` (Sinhala) file in `src/messages` with a few translated keys to demonstrate the setup.
Verification:
- The dashboard UI text is loaded from `en.json` when viewing `/en/dashboard`.
- The app should still run without errors if navigated to `/si/dashboard`, even if translations are incomplete.

## User B – Language-Aware Chat Flow
Deliverables:
1.  Update the `askGemini` flow in `src/ai/flows/chat.ts` to accept a `locale` parameter (e.g., "en", "si", "ta").
2.  Modify the system prompt to instruct the AI to respond in the requested language. For example: `You are an AI assistant... Your response must be in {{locale}}.`
3.  In `src/components/chat-interface.tsx`, get the current locale using the `useLocale` hook from `next-intl` and pass it to the `askGemini` flow.
Verification:
- Chatting with the AI from the `/en/chat` page should result in English responses.
- If tested from a future `/si/chat` page, the AI should attempt to respond in Sinhala.

## User C – Implement Basic Firestore Security Rules
Deliverables:
1.  Update the `firestore.rules` file with basic security rules based on the draft in `docs/firestore-rules-draft.md`.
2.  Implement rules for the `users` collection: only authenticated users can read their own data, and only admins can write.
3.  Implement rules for the `applications` collection: users can create applications and read/write their own, while a `worker` role can read all applications.
4.  (No deployment needed, just update the file content for the next prototype stage).
Verification:
- The `firestore.rules` file contains rules that reflect the access matrix for `users` and `applications`.

## User D – Admin User Management Enhancements
Deliverables:
1.  In the "Add New User" dialog at `src/app/admin/users/page.tsx`, automatically create an auth user in Firebase Authentication using `createUserWithEmailAndPassword` upon form submission.
2.  Ensure the UID from the newly created auth user is used as the document ID in the `users` collection in Firestore for consistency.
3.  Add password validation to require at least 6 characters.
Verification:
- Adding a new worker from the admin panel creates an account in both Firebase Auth and Firestore.
- The user can then log in with the specified credentials.

## User E – Worker Profile Page
Deliverables:
1.  Create a new page at `src/app/worker/profile/[id]/page.tsx`.
2.  This page should fetch and display the worker's profile information (name, email, role) from the `users` collection.
3.  Allow the worker to update their own password (UI only, no backend logic for now).
4.  Allow the worker to update their profile picture, saving it to their user document in Firestore (similar to the admin profile page).
Verification:
- A logged-in worker can navigate to their profile page and see their details.
- The UI for updating the password and profile picture is functional.

---
Shared Non-Functional Requirements:
- Ensure all new UI elements are responsive.
- Continue using shadcn/ui components for consistency.
- All database interactions must respect the new security rules.

Out of Scope This Sprint:
- Full translation of all content into Sinhala and Tamil.
- Real-time updates based on language changes without a page refresh.
- Enforcing complex, field-level validation in Firestore rules.

Submission Guidelines:
- Update `CHANGELOG.md` with a new entry for Sprint 3 deliverables.
- Reference the originating task in PRs (e.g., "Completes User A task for Sprint 3").
