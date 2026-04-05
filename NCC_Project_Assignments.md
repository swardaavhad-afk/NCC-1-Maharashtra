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

**Design and Development of Interactive Form (Authentication)**

**Aim / Objective**
To design and implement an interactive form using HTML/JS and dynamically capture and validate user data (Admin/Cadet Registration & Login) within the application.

**Problem Statement**
The system requires secure authentication for both Administrative Officers and Cadets. The task is to create an interactive form that handles role-switching, captures credentials, and processes login requests dynamically.

**Theory / Concept**

- **Form elements:** Inputs, password fields, buttons.
- **Event handling:** Capturing form submissions (`e.preventDefault()`).
- **Local Storage:** Storing user session tokens securely on the client side.

**Steps / Procedure**

1.  **Create Forms:** Designed HTML forms for Login, Admin Registration, and Cadet Registration in `index.html`.
2.  **Add Authentication Logic:** Handled form submission in `auth.js`.
3.  **Implement API Payload Creation:**
    - Captured form fields (Email, Password, Enrollment Number) using FormData.
4.  **State Management:**
    - Saved standard response (JWT Token, User info) to `localStorage`.
    - Rendered the respective dashboard (Admin or Cadet) dynamically upon success.
5.  **UI Feedback:** Implemented a `showToast()` function to display success/error popups during login attempts.

**Output / Result**
Interactive login and registration forms created successfully. User credentials captured correctly and UI dynamically updates to show the dashboard upon authentication.

---

## Assignment 4

**Backend API Development and Database Integration**

**Aim / Objective**
To develop RESTful APIs using Node.js and Express, connect with a PostgreSQL database via Supabase, and perform CRUD operations for handling NCC data.

**Problem Statement**
The frontend interface needs real data. The task is to build a robust backend API server that stores and retrieves cadet records, attendance, camps, and study materials securely.

**Theory / Concept**

- **RESTful APIs:** Router modules separating different resources (cadets, camps, auth).
- **Supabase (PostgreSQL):** Using the Supabase JS client to query relational data.
- **Middleware:** Creating auth middlewares to protect private routes.

**Tools & Technologies Used**

- Node.js & Express.js
- Supabase Client (`@supabase/supabase-js`)
- Postman – API testing

**Steps / Procedure**

1.  **Initialize Backend:** Configured `backend/server.js` and installed packages (`express`, `cors`, `dotenv`).
2.  **Connect Database:** Initialized Supabase client in `backend/config/supabase.js`.
3.  **Database Schema:** Executed `supabase-full-schema.sql` containing tables for `users`, `cadets`, `camps`, `attendance`, `achievements`.
4.  **Develop RESTful APIs:**
    - Created `routes/auth.js`, `routes/cadets.js`, `routes/camps.js`.
    - Created controllers to handle the business logic (e.g., fetching enrolled camps).
5.  **Middleware:** Added `auth.js` middleware to verify JWT tokens natively using Supabase auth logic.
6.  **Test APIs:** Used Postman to verify GET and POST requests.

**Output / Result**
Backend Express server running successfully. Supabase PostgreSQL database connected. RESTful APIs implemented for data operations like retrieving cadets or updating attendance.

---

## Assignment 5

**Full Project Integration and Deployment**

**Aim / Objective**
To integrate the Vanilla JS frontend with the Node.js backend APIs, test all functionalities, deploy the backend services, and host the frontend to demonstrate a complete working system.

**Problem Statement**
Connect the separate frontend views with backend Express routes, ensure proper HTTP data flow, and deploy the full stack project online using modern hosting platforms like Vercel or Render.

**Theory / Concept**

- **API Integration:** Connecting UI components using the `fetch()` API (`frontend/js/api.js`).
- **Deployment:** Hosting the application online using configurations like `vercel.json` and environments.

**Steps / Procedure**

1.  **Integrate Frontend with Backend:**
    - Configured the `api.js` wrapper utility to attach Bearer tokens to headers automatically.
    - Connected frontend functions to backend endpoints (e.g., fetching attendance list dynamically on dashboard load).
2.  **Test Full Flow:** Verified complete end-to-end flow: Admin logs in -> Admin creates a camp -> Cadet logs in -> Cadet views and enrolls in the camp.
3.  **Environment Variables:** Configured `.env` variables for database URLs, Supabase keys, and API ports.
4.  **Deploy Application:**
    - Used `vercel.json` for serverless deployment routing.
    - Hosted the repository dynamically.
5.  **Final Testing:** Fixed CORS issues and validated UI behavior in the production environment.

**Output / Result**
Frontend and backend successfully integrated with real-time Supabase data flow. Application hosted online successfully.
