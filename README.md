# AI Employee Support Assistant - Frontend

React frontend for the AI Employee Support Assistant Spring Boot backend. Built with
React 18, React Router, Axios, and Vite.

## Features
- Register / Login with JWT authentication (token stored in localStorage)
- Dashboard showing the logged-in employee's profile
- Leave application form + leave history table
- Attendance check-in / check-out + attendance history table
- Payroll / payslip viewer
- AI HR Chatbot chat window connected to `/api/chatbot/ask`
- Automatic JWT attachment on every API request (Axios interceptor)
- Automatic logout on token expiry (401 response)
- Protected routes (redirects to /login if not authenticated)

## Prerequisites
- Node.js 18+ and npm
- The backend (ai-employee-support-assistant) running on `http://localhost:8080`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the backend URL in `.env` (already set to localhost:8080 by default):
```
VITE_API_URL=http://localhost:8080
```
If you're accessing the backend via ngrok or a different host, update this value.

3. Run the development server:
```bash
npm run dev
```
The app will start on **http://localhost:3000**

4. Build for production:
```bash
npm run build
```
Output goes to the `dist/` folder.

## Project Structure
```
src/
  services/
    api.js              -> Axios instance with JWT interceptor
    authService.js       -> register, login, logout, getCurrentUser
    employeeService.js    -> leave, attendance, payroll, chatbot calls
  context/
    AuthContext.jsx      -> global auth state (email, role)
  components/
    Navbar.jsx
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Leaves.jsx
    Attendance.jsx
    Payroll.jsx
    Chatbot.jsx
    PrivateRoute.jsx      -> route guard for authenticated pages
  App.jsx                 -> routes
  main.jsx                -> entry point
  index.css                -> global styles
```

## How it connects to the backend
- `src/services/api.js` creates a single Axios instance pointed at `VITE_API_URL`.
- Every request automatically attaches `Authorization: Bearer <token>` if a token exists
  in `localStorage`.
- On login, the JWT returned by `/api/auth/login` is stored in `localStorage` and reused
  for all subsequent requests.
- A 401 response from any endpoint automatically clears the stored token and redirects
  to `/login`.

## First-time setup (owner account)
Public self-registration is disabled. To create the very first account:
1. Go to `/owner-setup` in the app.
2. Enter your name, email, password, and the `app.owner-setup-key` value configured on
   the backend (`application.properties` or `OWNER_SETUP_KEY` env var).
3. This creates the owner (ADMIN) account. Log in with it afterwards.

## Adding employees
Once logged in as ADMIN or PROJECT_MANAGER, an **"Add Employee"** link appears in the
navbar. Only ADMIN can assign the PROJECT_MANAGER or HR role to a new account; everyone
else created is a plain EMPLOYEE.

## Forgot / Reset password
- `/forgot-password` — enter your email, a reset code is emailed to you.
- `/reset-password` — enter the code plus a new password.

## Payroll (role-aware)
- ADMIN / HR / PROJECT_MANAGER see a "Generate Payslip" form (pick an employee, month,
  salary breakdown) above their own payslip table.
- Plain EMPLOYEE accounts only see their own payslips.

## AI Chatbot — multi-language
No extra setup needed — ask the chatbot in English, Tamil, Hindi, or a mix, and it
replies in the same language.

## Notes
- Make sure the backend's CORS configuration allows requests from `http://localhost:3000`
  (the provided backend project already allows all origins by default).
- If you're using ngrok for the backend, update `VITE_API_URL` in `.env` to the ngrok URL,
  and rerun `npm run dev`.
