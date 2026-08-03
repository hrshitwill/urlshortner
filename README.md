# 🔗 URL Shortener

A full-stack URL Shortener application built using the MERN stack. Users can register, log in, create short URLs, track click analytics, and manage their own links securely.

---

## 🚀 Features

- User Authentication (JWT + HttpOnly Cookies)
- User Registration & Login
- Create Short URLs
- Redirect to Original URLs
- URL Analytics
- Delete URLs
- Protected Routes
- User Profile

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- NanoID

---

## 📁 Project Structure

```
urlshortner/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/urlshortner.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
BASE_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/logout |
| GET | /api/auth/me |

### URL

| Method | Endpoint |
|---------|----------|
| POST | /api/url |
| GET | /api/url |
| DELETE | /api/url/:id |
| GET | /api/url/:id/analytics |

---

## 📸 Screenshots

Add screenshots here after deployment.

---

## 👨‍💻 Author

Harshit Gupta