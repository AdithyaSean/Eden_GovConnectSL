
# TASKS (Next Prototype Iteration – Implementation Sprint 4)

Goal: Introduce advanced AI capabilities by creating a robust flow for extracting structured information from uploaded documents. Enhance the National ID service to use this new AI flow. Create a dedicated page for the document extraction tool for demonstration purposes.

Sprint 3 Stubs Completed (Reference):
- Internationalization (i18n) framework implemented using `next-intl`, including locale-based routing.
- Dashboard internationalized with `en.json` and sample `si.json`.
- Chat flow is now language-aware, accepting a `locale` parameter.
- Basic Firestore security rules for `users` and `applications` have been implemented.

---

## User A – Document Information Extraction AI Flow
Deliverables:
1.  Create a new Genkit flow at `src/ai/flows/extract-doc-info.ts`.
2.  The flow should be designed to be highly robust, capable of extracting structured data (Name, DOB, ID Number, Address, etc.) from poorly scanned or OCR-corrupted text from a Sri Lankan National ID card.
3.  Define detailed input and output Zod schemas (`ExtractDocInfoInput`, `ExtractDocInfoOutput`) that include confidence scores for each extracted field.
4.  The prompt should be engineered to handle common OCR errors and use contextual clues specific to Sri Lankan documents.
5.  Implement post-processing logic to clean up and standardize the extracted data (e.g., date formats).
Verification:
- The `extractDocInfo` flow can be called with raw text and returns a structured JSON object with extracted fields and confidence scores.
- The flow demonstrates tolerance for common OCR errors.

## User B – Integrate AI Extraction into National ID Service
Deliverables:
1.  Update the `NationalIdService` component in `src/components/services/national-id-service.tsx`.
2.  After the user uploads the required documents (e.g., Birth Certificate or NIC copy), use a client-side utility to perform OCR on the primary document.
3.  Call the new `extractDocInfo` flow with the OCR text.
4.  Display the extracted, structured data to the user in a dialog for review and confirmation before final submission. This demonstrates the "human-in-the-loop" verification step.
Verification:
- Submitting a document in the National ID service flow triggers the AI extraction.
- An alert dialog appears showing the user the data extracted by the AI for their confirmation.
- The extracted data is included in the application payload sent to Firestore.

## User C – Document AI Tool Page
Deliverables:
1.  Create a new page at `src/app/[locale]/tools/document-ai/page.tsx`.
2.  This page will serve as a standalone demonstration of the document extraction AI.
3.  Include a file upload component (`FileUpload`) that allows the user to upload an image of a document (e.g., an ID card).
4.  On upload, the page should perform OCR, call the `extractDocInfo` flow, and display both the raw extracted text and the final structured JSON output in a user-friendly format.
Verification:
- Users can navigate to the "Document AI Tool" page.
- Uploading an image of a Sri Lankan ID card displays the extracted information on the page.

## User D – Refine Admin User Management
Deliverables:
1.  In `src/app/admin/users/page.tsx`, when adding a new user, ensure the password field has a minimum length validation (e.g., 6 characters) on the client side.
2.  Update the `handleAddUser` function to use `createUserWithEmailAndPassword` from Firebase Auth and then create the corresponding user document in Firestore using the UID from the auth object. This ensures consistency between Auth and Firestore.
Verification:
- The "Add New User" form shows an error if the password is too short.
- A new worker created through the admin panel can successfully log in with their credentials.
- The user's document ID in the `users` Firestore collection matches their UID in Firebase Authentication.

## User E – Worker Profile Page
Deliverables:
1.  Create a new page at `src/app/worker/profile/[id]/page.tsx` for workers to view and manage their own profiles.
2.  The page should fetch and display the worker's profile information (name, email, role) from Firestore.
3.  Allow the worker to update their profile picture, similar to the admin profile page.
4.  Include a section to update their password (UI only, no backend logic for now).
Verification:
- A logged-in worker is automatically redirected to their correct profile page.
- The profile information is displayed correctly.
- The profile picture can be updated and is persisted.

---
Shared Non-Functional Requirements:
- Ensure all new UI elements are responsive and use `shadcn/ui` components.
- Document the new AI flow with comments explaining its purpose and schemas.

Out of Scope This Sprint:
- Support for document types other than Sri Lankan National ID cards in the extraction flow.
- Real-time OCR progress indicators.
- Storing and managing multiple versions of extracted data.

Submission Guidelines:
- Update `CHANGELOG.md` with a new entry for Sprint 4 deliverables.
- Reference the originating task in PRs (e.g., "Completes User C task for Sprint 4").
