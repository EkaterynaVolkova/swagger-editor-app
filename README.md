# Swagger/OpenAPI UI Application 🚀

A modern, full-stack React application designed to edit, view, and test RESTful APIs using the OpenAPI/Swagger specification, equipped with powerful REST client capabilities.

🔗 **[Live Demo on Netlify](https://swaggerapp.netlify.app/en)**
---

## 👥 Development Team

- **Developer:** [Ekaterina Volkova](https://github.com/EkaterynaVolkova)
- **Developer:** [Yuri Skrypal](https://github.com/Sepulator)
- **Developer:** [Andrei Tishchenko](https://github.com/AndreyTishchenko)

---

## 🛠️ Technology Stack

- **Framework:** Next.js
- **Styling & UI:** Tailwind CSS, DaisyUI
- **API Parsing & Reference:** `@scalar/api-reference-react`
- **Internationalization:** `next-intl` (Multi-language support)
- **Testing:** Vitest, React Testing Library
- **Database & Auth:** Firebase Firestore / Authentication

---

## ⚡ Key Features

- **Dynamic Swagger Editor:** Supports both JSON and YAML OpenAPI schemas with auto-detection, schema validation, and real-time conversion (JSON ↔ YAML).
- **Interactive Viewer (Scalar):** Organizes endpoints by path/method, lists parameters (path, query, header, cookie), and features a "Try-It-Out" client.
- **Secure History & Analytics:** Authenticated users can track past requests, view performance metrics (duration, sizes, status codes), and restore saved schemas.
- **Responsive Split View:** Smart layout that adjusts to horizontal or vertical orientations dynamically.

---

## ⚙️ Local Development Setup

Follow these steps to run the application locally:

### 1. Clone the repository

```bash
git clone [Swagger Editor App](https://github.com/EkaterynaVolkova/swagger-editor-app)
cd swagger-editor-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and fill in your credentials (e.g., Firebase configuration if applicable):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Run the development server

```bash
npm run dev
```

## 🧪 Testing and Quality Control

We maintain high test coverage and strict code quality guidelines.

**Run unit tests:**

```bash
npm run test
npm run test:coverage
```
