<!--
CHANGELOG.md
Purpose: Track notable changes to documentation, data model diagrams, and implementation stubs during the prototype & early sprints.
Format: Keep chronological (most recent first). Use semantic grouping (Docs, Diagrams, Data Model, Code Stubs). Avoid listing trivial typo fixes.
Versioning Strategy (Prototype Phase): Date-based entries with optional tags (Prototype, Sprint-1, etc.). Formal semantic versioning can begin once a deployable MVP baseline is established.
-->

# Changelog

## 2025-08-15 – Sprint 1 Implementation Stubs
Category | Change
-------- | ------
Code Stubs | Added `src/lib/service-schemas/passport-renewal.ts` with Zod schema for dynamic forms (per `service-schema.md`).
Code Stubs | Created `src/components/dynamic-form.tsx` to render forms from a schema (per `TASKS.md`, User A).
Code Stubs | Implemented demo page at `src/app/services/passport-renewal/demo/page.tsx` using the dynamic form (per `TASKS.md`, User A).
Code Stubs | Added `src/lib/automation/prompt-builder.ts` utility to generate automation prompts from form data (per `browser-automation-plan.md`).
Code Stubs | Updated Genkit flows (`chat`, `suggest-services`, `summarize-service-info`) to use the new `src/lib/prompts/registry.ts` accessor (per `prompt-registry.md`).
Code Stubs | Added initial `firestore.rules` draft file (per `firestore-rules-draft.md`).
Code Stubs | Created `src/lib/security/validators.ts` for application status transition checks (per `TASKS.md`, User D).
Code Stubs | Added admin checkpoint UI at `src/app/admin/checkpoints/page.tsx` and `src/components/checkpoint-table.tsx` (per `hitl-checkpoints.md`).
Docs | Updated `TASKS.md` to define scope for Sprint 2 implementation.

## [Unreleased]
Planned:
- Initial Sprint 1 implementations (dynamic form stub, prompt registry accessor, automation prompt builder, validators, checkpoint admin UI) per `docs/TASKS.md`.
- Add PromptTemplate metadata field & guardrail enforcement logic (PLAN §3.1).
- Pin exact commit SHA for `browser-use` integration plan (PLAN §3.4).

## 2025-08-14 – Sprint-1 Simulated Automation Slice (Prototype)
Category | Change
-------- | ------
Code Stubs | In-memory Prompt Registry with seeds and lightweight version logging wired into flows (`chat`, `suggest-services`, `summarize-service-info`).
Code Stubs | Dev Debug Panel (Alt+D) with last 100 events, client emitter (`emitDebug`) and server logger; panel mounted in root layout.
Code Stubs | Passport renewal demo page (`/services/passport-renewal/demo`) using `DynamicForm`, run status polling, and receipt display.
Code Stubs | Simulated automation APIs: create runs, get run status, list checkpoints, resolve checkpoint; in-memory store with events/receipts.
Code Stubs | Automation prompt builder utility + dev script (`scripts/dev-prompt-demo.ts`) printing sample prompt JSON.
Code Stubs | Application status transition validator + demo script (`scripts/validators-demo.ts`).
Docs | README updated with simulated prototype usage and dev scripts.
Security | Draft `firestore.rules` added (not enforced in prototype).

## 2025-08-13 – Documentation Consistency Alignment (Prototype)
Category | Change
-------- | ------
Docs (PLAN) | Added explicit `checkpoints` collection to Data Model Additions; clarified pending ER diagram updates.
Docs (HITL) | Added `CompleteApplication` note as synonym; clarified preference for `AutomationComplete`.
Docs (Browser Automation Plan) | Expanded fieldMap to include `appointmentDate` & `urgency`; added TODO for pinned commit SHA; standardized prompt key naming.
Docs (Prompt Registry) | Added consistency notes: standardized keys (`chat`, `suggestServices`, `summarizeServiceInfo`, `automation.fillForm`); metadata deferment rationale.
Docs (Firestore Rules Draft) | Included checkpoints in access matrix and draft rule snippet; noted future status transition validator.
Sequence Diagram (Application Submission) | Fixed step numbering to 3-step schema; standardized completion audit action; added notes on prompt keys & checkpoints.
Sequence Diagram (Chat) | Normalized prompt template key (`chat`).
ER Diagram | Added `Checkpoint` table and relationships (AgentRun & Application associations).

Notes:
- No runtime code alterations introduced with these documentation edits.
- Open deferrals tracked in PLAN §5 consistency note.

## Guidelines for Future Entries
When adding an entry:
1. Use ISO date (YYYY-MM-DD).
2. Group multiple related small edits under one heading if same context & date.
3. Reference originating doc or file paths (e.g., `docs/PLAN.md`).
4. Mark breaking conceptual shifts (e.g., renaming a collection) with a ⚠️ indicator.
5. For code stubs introduced, briefly describe purpose & link back to design doc section (e.g., PLAN §2.1).

Template:
```
## YYYY-MM-DD – Short Title
Category | Change
-------- | ------
Docs | ...
Diagrams | ...
Data Model | ...
Code Stubs | ...
```

End of file.
