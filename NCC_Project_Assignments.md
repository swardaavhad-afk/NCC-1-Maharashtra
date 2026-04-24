# PROJECT ASSIGNMENTS

**NCC Cadet Management System**

Full Stack Web Development

**Technology Stack**
HTML / CSS / Vanilla JS · Node.js + Express · Supabase (PostgreSQL) · Docker

---

## Assignment 1

**Environment Setup and Requirement Gathering**

**Aim / Objective**
To install and configure development tools, select appropriate frontend, backend, and database technologies, and gather requirements for building a full-stack NCC Cadet Management System using Vanilla JS, Node.js, and Supabase (PostgreSQL).

**Problem Statement**
The NCC Cadet Management System aims to present dynamic dashboards for both Administrative Officers and Cadets. It requires session management, attendance tracking, camp enrollment, and achievement monitoring with a responsive UI. Before development, it is necessary to set up the local environment and understand requirements such as dual-role access (Admin/Cadet), secure data visualization, and reporting features.

**Theory / Concept**
Full Stack Development involves working on both the client-side and the server-side of an application:

- **Frontend (Client-side):** User interface, HTML views, and user experience (UX) using CSS/JS.
- **Backend (Server-side):** Business logic, REST APIs, database queries, and system integrations.

**Tools & Technologies Used**

- Visual Studio Code – Code editor
- Git & GitHub – Version control
- Postman – API testing tool
- Node.js – JavaScript runtime environment
- Docker – Containerization platform (for local DB/services setup)
- Vanilla JS / HTML / CSS – Chosen for lightweight, dependency-free frontend
- Express.js – Chosen for backend REST API server
- Supabase (PostgreSQL) – Chosen as the relational Database-as-a-Service

**Steps / Procedure**

1.  **Install Development Tools:** Installed VS Code, Git, Node.js, Postman, Docker.
2.  **Setup Project Environment:**
    - Created project folder: `NCC-1-Maharashtra`
    - Set up backend folder with Express server and `package.json`.
    - Configured frontend directory with HTML, CSS, and JS assets.
3.  **Select Technologies:**
    - Frontend: HTML5, CSS3, and Vanilla JS for DOM manipulation.
    - Backend: Node.js with Express mapped to Supabase.
4.  **Identify Client & Gather Requirements:**
    - **Domain:** Education / NCC Administration
    - **Functional Requirements:**
      - Role-based login and registration (Admin vs Cadet).
      - Dynamic dashboard fetching statistics (Total Cadets, Camps, Attendance).
      - Camp management and enrollment tracking.
      - Study materials uploading and fetching.
    - **Non-Functional Requirements:** Responsive web design, fast data fetching, secure authentication.

**Expected Output / Result**
Development environment successfully set up. Required tools installed and configured. Client requirements clearly documented for the NCC portal.

---

## Assignment 2

**Design and Development of Basic Frontend Layout and Dashboard**

**Aim / Objective**
To design and develop a responsive frontend layout for the NCC Management System using HTML, custom CSS, and Vanilla JavaScript, understanding basic UI/UX and responsive design principles.

**Problem Statement**
A professional management system requires a clean user-friendly interface to manage cadet data, camp details, and attendance seamlessly. The goal is to create layouts (Sidebar, Header, Main Dashboard) that adapt smoothly across devices.

**Theory / Concept**
Frontend development focuses on designing the user interface and experience. Key concepts include:

- **DOM Manipulation:** Dynamically updating UI elements using JavaScript.
- **Responsive Design:** Adjusting layouts using CSS Flexbox/Grid and media queries.
- **Modular JS:** Separating logic into different files (app.js, auth.js, api.js).

**Tools & Technologies Used**

- Visual Studio Code
- HTML5 & CSS3
- Vanilla JavaScript
- Web Browser (Chrome/Edge)

**Steps / Procedure**

1.  **Organize Frontend Folder Structure:**
    - `frontend/index.html` (Main SPA wrapper)
    - `frontend/css/style.css` (Styling)
    - `frontend/js/` (Separated JS controllers for admin, cadet, auth, API)
2.  **Design Basic Structure of Layout:**
    - **Sidebar:** Navigation menu dynamically rendering based on user role (Admin vs Cadet).
    - **Dashboard Content Area:** Welcome message indicating the user's name and role, KPI Stat Cards for total cadets, camps, and attendance percentages.
3.  **Apply Styling:**
    - Applied standard NCC colors (Red, Navy Blue, Light Blue).
    - Flexbox layout for aligning sidebar and main content.
4.  **Implement Interactivity:**
    - Used JavaScript to hide/show sections (`hideAllPages()`) to simulate a Single Page Application (SPA).
5.  **Test:** Tested responsiveness by resizing browser window.

**Output / Result**
A responsive dashboard layout successfully created. Sidebar and views toggle correctly using vanilla JS logic.

---

## Assignment 3

**Design and Development of Interactive Forms, Client-Side Validation, and Advanced DOM Manipulation**

**Aim / Objective**
To design, implement, and validate interactive forms using HTML5, advanced CSS, and Vanilla JavaScript. The assignment focuses on dynamically capturing user data (Admin/Cadet Registration, Login, Camp Creation, and Attendance Marking), performing rigorous client-side validation, and seamlessly updating the DOM without page reloads to ensure an optimized User Experience (UX).

**Problem Statement**
The NCC Cadet Management System requires secure and error-free data entry for multiple user roles (Administrative Officers and Cadets). Since inaccurate data can compromise operational efficiency, it is crucial to filter input errors on the client side before submission. Furthermore, the UI must dynamically toggle between different application states (like switching between Login and Dashboard views) based on form interactions to simulate a responsive Single Page Application (SPA).

**Theory / Concept**

- **Client-Side Validation:** Ensures that the data provided by the user is complete and structurally correct before sending it to the server. This reduces server load and provides immediate feedback to the user.
- **Advanced DOM Manipulation:** Using JavaScript to traverse and manipulate the Document Object Model dynamically. This includes creating elements, modifying classes, and updating content based on user state.
- **Event Delegation & Handling:** Binding event listeners to parent elements or specific form nodes to capture sub-events like inputs, clicks, and form submissions securely (`e.preventDefault()`).
- **Session & State Management:** Utilizing Web Storage (Local Storage/Session Storage) to manage authentication states, user roles, and UI preferences across page reloads.

**Tools & Technologies Used**

- HTML5 (Semantic Tags, Form Input Types, Custom Attributes)
- CSS3 (Transitions, Input Pseudo-classes like `:invalid` and `:valid`)
- Vanilla JavaScript (ES6+ features like Arrow Functions, Async/Await)
- Browser Developer Tools (for DOM inspection and debugging)

**Steps / Procedure**

1.  **Form Architecture & Design:**
    - Designed unified HTML form structures in `index.html` covering Login, Admin Registration, Cadet Registration, Camp Enrollment, and Study Material Uploads.
    - Added comprehensive accessibility markers (ARIA labels) and appropriate input types (`email`, `password`, `date`, `file`).
2.  **Implementation of Authentication Logic:**
    - Developed a resilient state controller in `auth.js` to handle form submissions and intercept default browser refresh behavior.
    - Mapped login inputs to specific user roles (Admin vs. Cadet), dynamically verifying credentials and structure.
3.  **Real-Time Data Capture & Validation:**
    - Implemented `FormData` abstractions to extract structured data from user inputs reliably.
    - Added regex-based client-side validation rules for:
      - _Enrollment Numbers_ (Specific NCC formatting requirements: `[State]/[Year]/[Wing]/[Number]`).
      - _Passwords_ (Minimum length, required character varieties).
      - _Date Constraints_ (Ensuring camp start dates precede end dates).
4.  **Local State Management:**
    - Secured the JWT Token, user ID, and role mapping within the browser's `localStorage`.
    - Wrote utility functions to check session validity on page load, instantly redirecting an authenticated user to their role-specific dashboard.
5.  **Dynamic UI Feedback Mechanisms:**
    - Created an animated overlay system (Toast Notifications using `showToast()`) that displays real-time success/error popups.
    - Designed custom loaders and button-state changes (e.g., changing "Login" to a spinner) to indicate background processing, preventing duplicate submissions.

**Output / Result**
A secure, highly interactive set of registration and functional forms was successfully created. Input is rigorously sanitized on the client side via custom JavaScript validation, reducing server round trips. The application successfully mimics a full SPA, seamlessly swapping UI panels from login screens to fully populated dashboards based exclusively on user interaction and local state.

---

## Assignment 4

**Backend RESTful API Development, Secure Routing, and Relational Database Integration**

**Aim / Objective**
To architect, develop, and secure highly scalable RESTful APIs using Node.js and Express.js, while establishing a robust connection to a managed PostgreSQL database (via Supabase) to perform sophisticated CRUD operations, complex querying, and role-based data manipulation for the NCC platform.

**Problem Statement**
The dynamic frontend dashboard depends exclusively on real-time, accurate dataset retrieval. The task involves engineering a high-performance backend server capable of handling simultaneous API requests, enforcing strict Role-Based Access Control (RBAC) to ensure Cadets cannot modify Admin resources, and securely handling relational data schemas involving users, camps, attendance, and achievements.

**Theory / Concept**

- **RESTful Architecture:** Designing scalable web services based on stateless operations and standardized HTTP methods (GET, POST, PUT, DELETE) mapped to distinct endpoints.
- **Middleware Integration:** Utilizing intermediate functions in the Express request-response cycle to perform tasks such as JWT decoding, role verification, and global error handling before reaching the core controller logic.
- **Relational Databases (PostgreSQL):** Structuring data into inter-connected tables with Primary and Foreign Keys ensuring referential integrity.
- **BaaS (Backend-as-a-Service):** Leveraging Supabase to dramatically accelerate database provisioning while retaining raw SQL modeling capabilities.

**Tools & Technologies Used**

- Node.js & Express.js (Core backend framework)
- Supabase Node.js Client (`@supabase/supabase-js`)
- PostgreSQL (Underlying relational database)
- JSON Web Tokens (JWT) for secure session persistence
- Postman / ThunderClient (For vigorous API boundary testing)

**Steps / Procedure**

1.  **Server Initialization & Global Configuration:**
    - Bootstrapped the Node.js application (`server.js`) using Express and essential middleware libraries including `cors` (for Cross-Origin Resource Sharing handling), `dotenv` (for secure environment variable management), and JSON body parsers.
2.  **Database Connection & Schema Generation:**
    - Integrated the Supabase client inside `backend/config/supabase.js` using strictly server-side `.env` keys.
    - Developed and executed advanced SQL migration scripts (`supabase-full-schema.sql`) to instantiate strongly-typed tables: `users`, `cadets`, `camps`, `attendance`, `achievements`, and `study_materials`. Ensure Foreign Key constraints linked `cadets.id` directly to `users.id`.
3.  **Controller Layer Implementation:**
    - Engineered modular controllers (`cadetController.js`, `campController.js`, `dashboardController.js`) to encapsulate complex business logic.
    - Implemented advanced querying logic: e.g., fetching a unified dashboard statistical overview (total active cadets, overall camp participation percentages, and aggregated attendance matrices) in a single optimized database call.
4.  **Route Modularization:**
    - Segmented application endpoints into dedicated routing files (`routes/cadets.js`, `routes/camps.js`, `routes/reports.js`) mapped to their respective controllers using Express Router, ensuring a clean and manageable codebase.
5.  **Security & Authorization Middleware:**
    - Built a robust `auth.js` middleware snippet that intercepts incoming HTTP requests, extracts the Bearer Token from headers, validates it against the Supabase Auth instance, and injects the resolved user context directly into the request payload.
    - Implemented role-guarding so that endpoints like `POST /api/camps` (Creating a new camp) are strictly limited to `Admin` users.
6.  **Comprehensive Endpoint Testing:**
    - Formulated a comprehensive Postman workspace to validate all CRUD permutations, simulating both Admin-level and Cadet-level token access to ensure ironclad security and proper JSON response formatting.

**Output / Result**
A secure, modular, and highly responsive Express backend server was successfully deployed and connected to the Supabase PostgreSQL cluster. Complex RESTful APIs have been successfully engineered, securely delivering aggregated analytics, cadet files, camp deployments, and attendance matrices to authenticated clients with full role-based access validation.

---

## Assignment 5

**Full Stack System Integration, CORS configuration, End-to-End Testing, and Cloud Deployment**

**Aim / Objective**
To seamlessly integrate the disparate frontend interface with the backend RESTful architectures, conduct rigorous End-to-End (E2E) testing across all user flows, overcome Cross-Origin communication constraints, and deploy the entire full-stack application securely into a scalable production cloud environment.

**Problem Statement**
A local development environment differs significantly from production. The final objective is to unite the Vanilla JS frontend and the Node.js distributed backend by routing HTTP requests correctly over the internet, handling asynchronous API responses seamlessly on the UI, and hosting the application on edge-optimized platforms (like Vercel) to provide global accessibility to the NCC Cadet Management System without uptime interruptions.

**Theory / Concept**

- **Full Stack Integration:** The synthesis of UI rendering logic with asynchronous network requests (`fetch()`) to dynamically populate the user interface with real database records.
- **Cross-Origin Resource Sharing (CORS):** Managing browser security mechanisms to allow the frontend domain to request distinct resources securely from the backend API domain.
- **Cloud Deployment & Serverless Architectures:** Transitioning local code into a hosted environment where platforms like Vercel automatically handle scale, SSL certification, and routing configurations via declarative rulesets.
- **CI/CD Fundamentals:** Utilizing Git pipelines to automatically push and deploy application updates from local repositories to production servers.

**Steps / Procedure**

1.  **Frontend-to-Backend Core Integration:**
    - Architected a centralized network request wrapper in `frontend/js/api.js` (e.g., an `apiCall()` abstraction) that automatically attaches Authorization Bearer tokens, sets correct Content-Type headers, and uniformly handles JSON parsing and error destructuring.
    - Refactored frontend rendering scripts (such as `dashboard.js` and `achievements.js`) to abandon local mock data, instead parsing raw arrays fetched dynamically from the matching `/api/` endpoints.
2.  **End-to-End (E2E) Workflow Validation:**
    - Conducted exhaustive multi-role testing encompassing complete lifecycles:
      - _Admin Flow:_ Registration -> Dashboard verification -> Creation of a new Camp -> Uploading a Study Material document -> Approving an Achievement -> Analyzing System Reports.
      - _Cadet Flow:_ Login -> Dashboard validation -> Fetching assigned study materials -> Applying for an upcoming Camp -> Reviewing attendance percentages.
3.  **Security & CORS Resilience Tuning:**
    - Configured the Express backend's CORS policies specifically allowing requests strictly from the hosted frontend domains, preventing unauthorized third-party API hijacking.
    - Synchronized environment variables (`.env`) for production credentials, ensuring database connection pooling functions optimally outside the local execution thread.
4.  **Vercel Deployment & Configuration:**
    - Drafted a highly specialized `vercel.json` descriptor file to instruct the platform on routing mechanics—diverting `/api/(.*)` requests directly to the Node.js serverless functions (defined in `backend/server.js`), while routing root queries directly to the `frontend/index.html` static asset layer.
    - Linked the active GitHub repository to the Vercel deployment pipeline, initiating automated builds upon main branch merges.
5.  **Production Auditing & Debugging:**
    - Evaluated the live application through browser network profilers, resolving minor HTTPS mixed-content warnings, optimizing static asset loading (CSS/JS minification concepts), and validating live Supabase data streams.

**Output / Result**
The NCC Cadet Management System has been fully integrated, securely transitioning from isolated frontend and backend environments into a cohesive, interactive full-stack web application. The platform is successfully deployed to a stable production cloud environment, handles CORS flawlessly, and fulfills all initial client requirements for both Administrative Officers and NCC Cadets.
