# GovConnect SL: Sri Lanka e-Citizen Platform

<div align="center">
  <img src="/public/images/GovSL%20Logo.svg" alt="GovConnect SL Logo" width="400" />
</div>

<div align="center" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 1rem;">
  <img src="https://img.shields.io/badge/coverage-82%25-blue?style=for-the-badge" alt="Coverage Status" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</div>

GovConnect SL is a modern, unified digital platform designed to streamline access to essential government services for all citizens of Sri Lanka. Our goal is to create a central, user-friendly hub that simplifies interactions with government agencies, reduces bureaucratic hurdles, and makes services more accessible, efficient, and transparent.

## ✨ Key Features

- **Centralized Dashboard**: A clean, card-based interface providing a snapshot of available services, application statuses, and quick actions.
- **Service Catalog**: Easily browse and apply for a wide range of government services, from passport renewals to vehicle registration.
- **Unified User Profile**: A single account gives you access to all integrated government services, with a central profile to manage your information.
- **Real-Time Notifications**: Stay updated on your application status and receive important alerts directly through the platform.
- **Secure Payments**: Integrated payment gateway for handling service fees, fines, and other government payments securely.
- **AI-Powered Support**: An intelligent chatbot is available to answer questions, guide you through processes, and help you find the right service.
- **Dedicated Admin & Worker Portals**: Separate, feature-rich interfaces for administrators and government workers to manage applications, users, and system analytics.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/AdithyaSean/gov-assist.git
    cd gov-assist
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Firebase configuration keys. You can get these from your Firebase project settings.

    ```env
    GMAIL_USER=
    GMAIL_APP_PASSWORD=
    NEXT_PUBLIC_APP_URL=
    GEMINI_API_KEY=
    NEXT_PUBLIC_FIREBASE_API_KEY=
    ```

### Running the Application

1.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

2.  **Seed the database (Optional but Recommended):**
    The seeder utility populates your local Firestore database with sample users (citizens, workers, admins), applications, and other records, allowing you to test the full functionality of the platform immediately.

    To seed the database, navigate to `http://localhost:9002/seed` in your browser and click the "Reset & Seed Database" button.
    
    **The password for all seeded user accounts is `password123`.**

    You can use the following emails to log into the Admin & Worker portal:
    - **Super Admin:** `worker.admin@gov.lk`
    - **Transport Worker:** `worker.transport@gov.lk`
    - **Immigration Worker:** `worker.immigration@gov.lk`
    - **Identity Worker:** `worker.identity@gov.lk`
    - **Support Worker:** `worker.support@gov.lk`

3.  **Run Genkit for AI Features:**
    To enable the AI chatbot and other generative features, run the Genkit development server in a separate terminal:
    ```sh
    npm run genkit:dev
    ```

## 🧪 Running Tests

To run the automated tests for this project, use the following command:

```sh
npm test
```

This will launch Jest in watch mode, automatically re-running tests as you make changes to the code. Don't forget to check your spam inbox for for account verification emails.
