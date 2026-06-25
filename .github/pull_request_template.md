1. Task: https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md

2. Screenshot:
*(Drag-and-drop your screenshot here)*

3. Deployment: [link Vercel/Netlify/Render]

4. Done 14.07.2026 / deadline 14.07.2026

5. Score: 0 / 550

- Feature 1: App Header (0/60)
  - [ ] Non-authenticated users see Sign In and Sign Up buttons (15)
  - [ ] Authenticated users see History and Sign Out buttons (10)
  - [ ] Navigation link to About page is available in header and footer (10)
  - [ ] If the token is expired/invalid, the user is redirected from private routes to the Main page (10)
  - [ ] Pressing the Sign In / Sign Up button redirects to the route with the respective form (15)

- Feature 2: Sign In / Sign Up (0/50)
  - [ ] Buttons for Sign In / Sign Up / Sign Out are present everywhere they should be (10)
  - [ ] Client-side validation is implemented (email format, password strength) (20)
  - [ ] Upon successful login, the user is redirected to the Main page (10)
  - [ ] If the user is already logged in and tries to reach Sign In / Sign Up routes, they are redirected to the Main page (10)

- Feature 3: Swagger Editor (0/120)
  - [ ] Loading/pasting OpenAPI/Swagger schema in JSON and YAML formats is supported (25)
  - [ ] Auto-detection of input format (JSON vs YAML) is implemented (20)
  - [ ] Format switching with automatic conversion (JSON ↔ YAML) works correctly (20)
  - [ ] Schema validation with error indication is implemented (15)
  - [ ] Authenticated users can save schemas; the saved schema is automatically restored in the editor upon next login (10)
  - [ ] The Viewer automatically populates with endpoints when the schema is valid (10)
  - [ ] Responsive split view adjusts based on screen orientation (horizontal/vertical) (20)

- Feature 4: Swagger Viewer (0/120)
  - [ ] Endpoint list is displayed with organization by path/method (20)
  - [ ] Endpoint details show method, path, and all parameter types (path, query, header, cookie) (25)
  - [ ] Request schema and example payloads are displayed (20)
  - [ ] Response schema, examples, and all supported status codes are displayed (25)
  - [ ] Try-It-Out functionality allows filling parameters, headers, and body; executing requests; and displaying responses (20)
  - [ ] Generate cURL button with copy-to-clipboard functionality is implemented (10)

- Feature 5: History and Analytics (0/70)
  - [ ] History and analytics is server-side generated and shows an informational message with links to the editor/viewer when there are no requests in the database (15)
  - [ ] Requests are displayed sorted by timestamp (most recent first) (10)
  - [ ] The following analytics are recorded from the server side and displayed: request duration, response status code, request timestamp, request method, request size, response size, error details, endpoint/URL (45)

- Feature 6: About Page (0/25)
  - [ ] About page is accessible to all users (public route) (5)
  - [ ] About page contains information about the RS School course (5)
  - [ ] About page contains team member information (names, roles, GitHub links) (10)
  - [ ] About page design is consistent with the application design (5)

- Feature 7: General Requirements (0/55)
  - [ ] Multiple (at least 2) languages are supported with an i18n toggler in the header (30)
  - [ ] Sticky header with animation when it becomes sticky is implemented (10)
  - [ ] Errors are displayed in a user-friendly format (10)
  - [ ] Private routes are properly protected (401 if not authenticated) (5)

- Feature 8: YouTube Video (0/50)
  - [ ] A 5–7 minute YouTube video walkthrough is linked in the pull request demonstrating all implemented features (50)