# Road2Resolution 🚧
### AI-Powered Smart Civic Issue Reporting & Resolution Platform

**Road2Resolution** is an AI-powered civic technology platform designed to improve urban infrastructure management by connecting citizens, municipal administrations, repair organizations, and field workers.

The platform enables citizens to report road and infrastructure problems, uses AI-based image classification to identify civic issues, calculates issue priority, and helps administrators coordinate repair operations through registered organizations and individual workers.

It provides an end-to-end workflow for reporting, assigning, tracking, and verifying civic infrastructure complaints.

---

## 🌟 Key Features

### 👥 1. Citizen Portal

- **AI-Powered Issue Reporting:** Upload or capture images of civic infrastructure problems for AI-based classification.
- **Automatic Issue Detection:** Identifies civic and non-civic images using a two-stage deep learning pipeline.
- **Severity Assessment:** Generates severity levels and priority scores based on detected issue categories.
- **Duplicate Complaint Detection:** Detects potentially similar active complaints using geographical proximity and issue category.
- **Interactive Map:** Explore reported complaints using an interactive map with geographical locations.
- **Complaint Tracking:** Track complaint status and view the complete issue timeline.
- **Citizen Dashboard:** View submitted complaints, their current status, and resolution progress.
- **Repair Verification:** Access repair verification information and before-and-after evidence.

### 🤖 2. AI-Powered Image Classification

Road2Resolution uses a dedicated Python-based AI microservice powered by PyTorch and ResNet18.

The AI system follows a two-stage classification architecture.

**Stage 1: Civic vs Non-Civic Classification**

- Identifies whether an uploaded image represents a civic infrastructure issue.
- Filters irrelevant or non-civic images.
- Uses a configurable civic confidence threshold of 0.625.

**Stage 2: Civic Issue Classification**

Images that pass Stage 1 are classified into four categories:

| Class | Detected Issue |
|---|---|
| 0 | Garbage |
| 1 | Illegal Dumping |
| 2 | Pothole |
| 3 | Water Drainage |

**AI Pipeline:**

```text
          Uploaded Image
                 |
                 v
       Stage 1: ResNet18
                 |
                 v
       Civic or Non-Civic?
                 |
          +------+------+
          |             |
       Non-Civic       Civic
          |             |
          v             v
       Rejected    Stage 2: ResNet18
                        |
                        v
                Issue Classification
                        |
          +-------------+-------------+
          |             |             |
        Garbage     Illegal       Pothole
                    Dumping
                        |
                  Water Drainage
                        |
                        v
               Prediction & Confidence
```

**AI Model Evaluation:**

The model handoff documentation reports the following Stage 2 evaluation results:

| Metric | Reported Result |
|---|---:|
| Test Images | 408 |
| Accuracy | 95.59% |
| Macro Precision | 97.38% |
| Macro Recall | 95.20% |
| Macro F1-Score | 96.24% |

*Note: These are reported model evaluation metrics from the supplied model documentation, not a guarantee of performance on every real-world image.*

### 🛠️ 3. Worker & Organization Portal

Road2Resolution supports two types of worker registration:

**Individual Worker**
- Register as an individual worker.
- Access eligible civic repair complaints.
- Accept available repair tasks.
- Manage assigned work.
- Upload repair completion evidence.
- Track submitted repair work.
- Manage worker profile and SLA turnaround information.

**Organization / Contractor**
- Register as an organization or contractor.
- Manage organization-related repair operations.
- Access organization-assigned complaints.
- Accept tasks on behalf of the organization.
- Coordinate repair activities through registered workers.

**Repair Workflow:**

- View available complaints.
- Accept eligible repair tasks.
- Start repair operations.
- Upload before-and-after repair photographs.
- Submit repair evidence.
- Track repair submission and verification status.

### 🏛️ 4. Admin Control Panel

The administrator has centralized control over civic complaint management.

Features include:

- **Admin Dashboard:** Monitor overall complaint statistics and platform activity.
- **Complaint Management:** View, manage, update, and delete reported issues.
- **Priority Queue:** Organize complaints according to their calculated priority.
- **Organization Assignment:** Assign complaints to eligible repair organizations.
- **Department Management:** Manage municipal departments.
- **Worker Management:** Provision worker accounts through administrative operations.
- **Live Map:** Monitor reported civic issues geographically.
- **Analytics Dashboard:** View issue trends, severity distribution, category breakdown, and department workload.
- **Risk Prediction:** Access the risk prediction dashboard.
- **Repair Verification:** Review submitted repair evidence and manage verification workflows.

### 📍 5. Location-Based Complaint Management

- Interactive maps powered by Leaflet.
- GPS-based location detection.
- Manual location selection.
- Geographic issue visualization.
- Proximity-based duplicate detection.
- Distance-based organization eligibility.
- Worker proximity filtering.
- Location-based repair evidence workflow.

### 🔔 6. Notifications & Real-Time Communication

- Socket.IO integration for real-time communication.
- Issue-related socket events.
- Notification management.
- Live notification updates.
- Backend notification job support.

### 📊 7. Analytics & Reporting

- Complaint trend analysis.
- Issue category distribution.
- Severity breakdown.
- Department workload analysis.
- Priority-based complaint management.
- Administrative report export.

---

## 🔐 Authentication & Role Management

The platform supports role-based authentication and protected access.

| User Role | Access |
|---|---|
| Citizen | Report and track civic complaints |
| Individual Worker | Access and manage eligible repair tasks |
| Organization Worker | Handle organization-related repair tasks |
| Admin | Manage complaints, organizations, departments, workers, and analytics |

**Authentication Features:**

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected frontend routes.
- Backend authentication middleware.
- Role-based authorization.
- Input validation.
- Rate limiting for selected public operations.
- Secure environment-based configuration.

Public registration is available for citizens and workers. Administrative registration is not available through the public registration page.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | User interface development |
| Vite | Frontend build tool |
| Tailwind CSS | Responsive UI styling |
| React Router DOM | Application routing |
| Axios | API communication |
| Leaflet | Interactive maps |
| React Leaflet | React map integration |
| Recharts | Data visualization |
| Lucide React | Icons |
| JavaScript | Application logic |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | REST API development |
| MongoDB | Database |
| Mongoose | Database modelling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Multer | File upload handling |
| Socket.IO | Real-time communication |
| Nodemailer | Email functionality |
| Cookie Parser | Cookie management |
| CORS | Cross-origin resource sharing |

### AI / Machine Learning

| Technology | Purpose |
|---|---|
| Python | AI service development |
| PyTorch | Deep learning framework |
| Torchvision | ResNet18 architecture |
| ResNet18 | Image classification |
| FastAPI | AI inference API |
| Uvicorn | ASGI server |
| Pillow | Image processing |

---

## 🏗️ Project Architecture

Road2Resolution follows a modular full-stack architecture with three major services.

```text
                 ROAD2RESOLUTION
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       Frontend       Backend       AI Service
       React          Node.js       Python
       Vite           Express       FastAPI
          |             |             |
          |             v             |
          |          MongoDB          |
          |             |             |
          |             v             |
          |         Cloudinary        |
          |                           |
          +---------- API ------------+
                        |
                        v
               AI Image Classification
                        |
                        v
                Prediction & Results
                        |
                        v
              Complaint Management
```

### Project Folder Structure

```text
Road2Resolution/
│
├── AI/
│   ├── models/
│   │   ├── stage1_clutter_lr1e-6_epoch1.pth
│   │   └── road2solution_stage2_resnet18_best_epoch4.pth
│   └── model_handoff.json
│
├── AIModelService/
│   ├── app.py
│   ├── inference.py
│   ├── model_loader.py
│   ├── requirements.txt
│   └── .gitignore
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── test_ai_integration.js
│   └── test_auth_matrix.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── citizen/
│   │   │   ├── public/
│   │   │   └── worker/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── vercel.json
└── .gitignore
```

---

## ⚙️ Installation & Setup

Follow these steps to run Road2Resolution locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Python 3
- MongoDB (Local or MongoDB Atlas)
- Cloudinary account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Chitranshkumar18/Road2Resolution.git
```

Navigate into the project:

```bash
cd Road2Resolution
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a reference.

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/road2solution

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ADMIN_EMAIL=your_admin_email

ADMIN_INITIAL_PASSWORD=your_admin_initial_password

AI_MODEL_SERVICE_URL=http://127.0.0.1:8000
AI_SERVICE_URL=http://127.0.0.1:8000
```

Replace all placeholder values with your actual credentials.

**Important:** Use a strong JWT secret of at least 32 characters in production. Never upload your `.env` file or private credentials to GitHub.

Start the backend:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

Backend health check:

```text
http://localhost:5000/api/health
```

### 3. AI Model Service Setup

Open a new terminal from the project root.

Navigate to the AI service:

```bash
cd AIModelService
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate the virtual environment.

**Mac / Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Make sure both trained model checkpoint files are available in a directory that the model loader can discover. By default, the repository's `AI/models/` directory is supported.

Start the AI service:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

AI service:

```text
http://127.0.0.1:8000
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

Prediction endpoint:

```text
http://127.0.0.1:8000/predict
```

The model checkpoints are loaded lazily when inference is requested to reduce startup memory consumption.

### 4. Frontend Setup

Open another terminal from the project root.

Navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Road2Solution CivicVision"
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

### 5. Build for Production

To create the production frontend build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run the backend in production:

```bash
npm start
```

---

## 🔌 API Overview

The backend provides REST APIs for the different platform modules.

Base API URL:

```text
/api
```

| Module | Base Endpoint | Description |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, profile and logout |
| Issues | `/api/issues` | Complaint creation and management |
| AI | `/api/ai` | AI image analysis |
| Organizations | `/api/organizations` | Organization management |
| Admin | `/api/admin` | Administrative operations |
| Worker | `/api/worker` | Worker operations |
| Analytics | `/api/analytics` | Platform analytics |
| Reports | `/api/reports` | Report submission and export |
| Reviews | `/api/reviews` | Public reviews and feedback |

Backend health endpoint:

```text
GET /api/health
```

AI service endpoints:

```text
GET  /health
POST /predict
POST /predict-json
```

For detailed endpoint implementations, refer to:

```text
Backend/src/routes/
Backend/src/controllers/
Backend/src/services/
```

---

## ☁️ Deployment

Road2Resolution is structured to support separate deployment of the frontend, backend, and AI inference service.

### Frontend
- Deployment using Vercel.
- Vite production build.
- SPA routing rewrites configured through `Frontend/vercel.json`.

### Backend
- Node.js and Express deployment.
- MongoDB database connection through environment variables.
- Cloudinary integration for image storage.
- CORS configuration for trusted frontend origins.

### AI Model Service
- Python FastAPI deployment.
- PyTorch CPU-based inference.
- Lazy model loading for memory optimization.
- Separate deployment from the Node.js backend.

### Production Environment Variables

Configure the following environment variables in the respective hosting platforms:

**Backend:**
- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_INITIAL_PASSWORD`
- `AI_MODEL_SERVICE_URL`

**Frontend:**
- `VITE_API_URL`
- `VITE_APP_NAME`

**AI Service:**
- `PORT`
- `MODEL_DIR` (only if using a custom model checkpoint directory)

Make sure the backend AI service URL points to the deployed FastAPI service in production.

---

## 🔒 Security Considerations

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected routes and role-based authorization.
- Backend request validation.
- Rate limiting for selected public endpoints.
- Restricted CORS origins.
- Secure environment variable management.
- Production JWT secret validation.
- Protected administrative operations.

Never expose database credentials, JWT secrets, or Cloudinary API secrets in frontend code or public repositories.

---

## 🚀 Project Highlights

- Full-stack MERN application.
- Dedicated Python AI microservice.
- Two-stage ResNet18 image classification.
- AI-assisted civic complaint categorization.
- Automated issue priority calculation.
- Location-based complaint discovery.
- Duplicate complaint detection.
- Citizen, individual worker, organization, and admin workflows.
- Real-time communication using Socket.IO.
- Repair evidence submission and verification workflows.
- Analytics and administrative reporting.

---

## 👨‍💻 Author

**Chitransh Kumar**

GitHub: [@Chitranshkumar18](https://github.com/Chitranshkumar18)

---

## 📄 License

No explicit open-source license is currently specified in this repository. All rights are reserved by the project author unless a license is added.

---

⭐ If you find Road2Resolution interesting, explore the project and its implementation!
