# CivicVision AI - Intelligent Civic Issue Reporting & Resolution Platform

An AI-powered web platform connecting citizens and municipal administrations to detect, prioritize, track, and resolve urban infrastructure issues (potholes, water main bursts, streetlights, garbage overflow, traffic hazards).

## 🚀 Key Features

### 👥 Citizen Portal
- **AI-Powered Reporting**: Live image scanning with YOLO-style bounding boxes, severity scores, and confidence levels.
- **Smart Duplicate Prevention**: Geographic radius matching and image similarity checks.
- **Interactive Explorer Map**: Real-time Leaflet map with status filters, clustering, and location picking.
- **Issue Timeline & Tracking**: Live status updates from report submission to AI verification and municipal dispatch.
- **Repair Verification**: AI before-and-after image verification for completed public works.
- **Citizen Reputation & Badges**: Community contribution points and achievement tiers.

### 🏛️ Municipal Admin & Department Command Center
- **Dynamic Priority Queue**: Multi-factor AI ranking ($P = 0.4 \times \text{Safety} + 0.3 \times \text{Traffic} + 0.3 \times \text{Severity}$).
- **Issue Dispatch & Triage**: Department routing (PWD, Water Board, Electrical, Sanitation, Traffic).
- **Incident Heatmaps**: High-density civic issue heatmaps and hotspot analysis.
- **Predictive Risk Modeling**: AI forecasting for seasonal damage and infrastructure decay.
- **Department Performance Analytics**: Recharts analytics on resolution speed, SLA compliance, and open workloads.

---

## 🛠️ Technology Stack
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (Protected citizen & admin routes)
- **Icons**: Lucide React
- **Maps**: Leaflet + React Leaflet
- **Data Visualizations**: Recharts
- **HTTP Client**: Axios (with smart mock fallbacks and live API support)

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Quick Demo Logins
- **Citizen Demo**: `citizen@civicvision.ai` (Password: any password)
- **Admin Demo**: `admin@civicvision.ai` (Password: any password)
- Or use the top navigation quick-role switcher anytime!
