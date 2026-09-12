# Road2Solution (CivicVision) - Civic Issue Reporting & Resolution Platform

An AI-powered civic platform connecting citizens, registered road repair organizations, workers, and municipal administrations to detect, prioritize, track, and resolve urban road and infrastructure issues.

---

## 🚀 Key Features

### 👥 Citizen Portal
- **AI-Powered Reporting**: Real-time live camera capture with neural diagnostic defect detection, severity estimation, and priority score computation.
- **Smart Duplicate Prevention**: Proximity and AI category checks against active reports.
- **Interactive Explorer Map**: Live Leaflet map with state/city filtering, GPS proximity, and location picking.
- **Issue Timeline & Tracking**: End-to-end complaint status lifecycle from verification to repair and QA certification.
- **Citizen Dashboard & History**: Filterable ledger of user-submitted complaints and live progress updates.

### 🛠️ Worker & Organization Portal
- **Real-Time Synchronized Complaints Queue**: Live feed of reported road defects with dynamic GPS distances calibrated to worker location.
- **Proximity Geofencing**: Automatic 50km/100km radius filtering.
- **Dual Acceptance Modes**: 
  - Accept task on behalf of an Assigned Organization.
  - Take direct personal responsibility as an Individual Worker / Citizen.
- **GPS-Enforced 250m Resolution Upload**: Live camera proof-of-work upload strictly unlocked within a 250-meter radius of the complaint site.

### 🏛️ Admin Control Desk
- **Dynamic Priority Queue**: Multi-variable priority scoring ranking urgent road hazards at the top of municipal queues.
- **Organization & Department Dispatch**: Assign complaints to eligible road repair organizations within a 75 km radius.
- **Repair QA Verification Console**: Interactive before-and-after audit workbench with AI differential verification matching.
- **Live Radar & Metropolitan Feed**: Comprehensive oversight across all reported civic issues.

---

## 🔐 Authentication & Roles

- **Citizen Registration**: Open registration for citizens on the registration page (`/register?role=citizen`).
- **Worker / Organization Registration**: Registration for road contractors, repair teams, and field workers on the registration page (`/register?role=worker`).
- **Admin Access**:
  - Admin registration is disabled from public registration.
  - Admin access is restricted to the authorized administrator account (`chitranshkumar730@gmail.com`) via the existing login page (`/login`).
  - Password authentication is securely verified by the backend API.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Routing**: React Router DOM (Role-protected routes)
- **Icons**: Lucide React
- **Maps**: Leaflet + React Leaflet
- **Data Visualizations**: Recharts
- **HTTP Client**: Axios (Connected to REST API backend)

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Road2Solution CivicVision"
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```
