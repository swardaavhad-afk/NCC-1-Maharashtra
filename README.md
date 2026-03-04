# NCC 01 MAH AIR SQN - Cadet Management System

![NCC Logo](https://upload.wikimedia.org/wikipedia/en/thumb/0/09/NCC_India_logo.svg/200px-NCC_India_logo.svg.png)

> **01 MAH AIR SQN NCC, MUMBAI (NASHIK DETACHMENT)**  
> Mumbai B Group | Maharashtra Directorate  
> "Unity and Discipline"

A full-stack MERN (MongoDB, Express.js, HTML/CSS/JS, Node.js) Cadet Management System with Supabase integration for NCC 01 Maharashtra Air Squadron.

---

## 🚀 Features

### Admin Dashboard
- **Cadet Management** – Full CRUD operations, search, profiles
- **Camp Management** – Create/manage ATC, CATC, NIC, TSC, RDC, IDC camps
- **Attendance Management** – GPS-verified attendance review and approval
- **Achievements Management** – Track cadet achievements at all levels
- **Study Materials** – Upload and manage training materials
- **Reports** – Comprehensive analytics and statistics

### Cadet Dashboard
- **Overview** – Personal stats, upcoming camps, achievements
- **Camp Registration** – Register for upcoming camps
- **Attendance** – GPS-verified attendance submission
- **Achievements** – View personal achievements
- **Study Materials** – Access training materials
- **Profile** – View personal, academic, contact, bank details

### Technical Features
- 🔐 JWT Authentication with bcrypt password hashing
- 📍 GPS-verified attendance with geolocation
- ☁️ Supabase integration (auth, storage, real-time)
- 🛡️ Security: Helmet, CORS, Rate Limiting
- 📱 Responsive design for mobile/desktop
- 🐳 Docker ready with docker-compose

---

## 📦 Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript |
| Backend   | Node.js, Express.js 4.21 |
| Database  | MongoDB with Mongoose 8.6 |
| Auth      | JWT + bcryptjs |
| Storage   | Supabase Storage |
| Security  | Helmet, CORS, Rate Limit |
| Deploy    | Docker, Vercel, Heroku |

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Supabase account (optional)

### 1. Clone & Install
```bash
git clone https://github.com/swardaavhad-afk/NCC-1-Maharashtra.git
cd NCC-1-Maharashtra
cd backend && npm install
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

Required environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ncc_maharashtra
JWT_SECRET=your_jwt_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Seed Database
```bash
cd backend && node seed/seedData.js
```
This creates:
- Admin: `admin@ncc1mah.in` / `admin123456`
- 5 sample cadets with full profiles
- 4 camps, 5 achievements, 5 study materials, ~130 attendance records

### 4. Start Server
```bash
# Development
cd backend && npx nodemon server.js

# Production
node backend/server.js
```

Open: **http://localhost:5000**

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

This starts MongoDB and the app. Access at **http://localhost:5000**

---

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

---

## 🌐 Deploy to Heroku

```bash
heroku create ncc-1-maharashtra
heroku config:set MONGODB_URI="mongodb+srv://..." JWT_SECRET="..."
git push heroku main
```

---

## 📂 Project Structure

```
├── frontend/                 # Static frontend
│   ├── index.html           # Main SPA page
│   ├── css/style.css        # Styles
│   ├── js/
│   │   ├── api.js           # API client
│   │   ├── auth.js          # Auth module
│   │   ├── app.js           # Bootstrap
│   │   ├── admin/           # Admin view modules
│   │   │   ├── dashboard.js
│   │   │   ├── cadets.js
│   │   │   ├── camps.js
│   │   │   ├── attendance.js
│   │   │   ├── achievements.js
│   │   │   ├── studyMaterials.js
│   │   │   └── reports.js
│   │   └── cadet/           # Cadet view modules
│   │       ├── dashboard.js
│   │       ├── camps.js
│   │       ├── attendance.js
│   │       ├── achievements.js
│   │       ├── studyMaterials.js
│   │       └── profile.js
│   └── assets/              # Images
├── backend/
│   ├── server.js            # Express entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── supabase.js      # Supabase client
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Cadet.js
│   │   ├── Camp.js
│   │   ├── Attendance.js
│   │   ├── Achievement.js
│   │   └── StudyMaterial.js
│   ├── controllers/         # Route handlers
│   ├── routes/              # API routes
│   ├── middleware/           # Auth & error
│   └── seed/                # Seed data
├── Dockerfile
├── docker-compose.yml
├── Procfile
├── vercel.json
├── supabase-setup.sql
└── README.md
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/admin` | — | Register admin |
| POST | `/api/auth/register/cadet` | — | Register cadet |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/cadets` | Admin | List cadets |
| GET | `/api/cadets/:id` | ✅ | Get cadet |
| DELETE | `/api/cadets/:id` | Admin | Delete cadet |
| GET | `/api/camps` | ✅ | List camps |
| POST | `/api/camps` | Admin | Create camp |
| POST | `/api/camps/:id/register` | Cadet | Register for camp |
| GET | `/api/attendance` | Admin | All attendance |
| POST | `/api/attendance` | Cadet | Submit attendance |
| PUT | `/api/attendance/:id/review` | Admin | Review attendance |
| GET | `/api/achievements` | ✅ | All achievements |
| POST | `/api/achievements` | Admin | Add achievement |
| GET | `/api/study-materials` | ✅ | All materials |
| POST | `/api/study-materials` | Admin | Upload material |
| GET | `/api/reports/overview` | Admin | Reports |
| GET | `/api/dashboard/admin` | Admin | Admin dashboard |
| GET | `/api/dashboard/cadet` | Cadet | Cadet dashboard |

---

## 🔑 Default Credentials

| Role | Login | Password |
|------|-------|----------|
| Admin | admin@ncc1mah.in | admin123456 |
| Cadet | MAH/AIR/24/0001 | cadet123456 |

---

## 📜 License

MIT License - Built for NCC 01 MAH AIR SQN, MUMBAI

---

**Jai Hind! 🇮🇳**
