<div align="center">

# 🎓 AI Viva Quiz Platform

**An AI-powered platform for practicing viva-style questions and quizzes.**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA--3-F55036?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📌 Overview

AI Viva Quiz Platform helps students prepare for viva-style assessments. It uses a large language model (LLaMA-3 served through Groq) to work with viva-style questions, and a full-stack web app (FastAPI backend, React frontend) to manage users and quizzes.

<!-- VERIFY: add 1-2 lines on exactly what the AI does in your app, e.g. "generates questions from a topic" or "evaluates typed answers". -->

---

## ✨ Features

- 🔐 **Secure authentication** with JWT (register and login)
- 🤖 **AI-powered viva questions** using LLaMA-3 via the Groq API
- 🗄️ **Persistent storage** with a serverless PostgreSQL database (Neon)
- ⚡ **Fast REST API** built with FastAPI
- 🖥️ **Modern frontend** built with React and Vite

<!-- VERIFY: add or remove features to match what is actually working today (quiz creation, scoring, history, etc.). Only list what is finished. -->

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React, Vite |
| Database | PostgreSQL (Neon) |
| AI model | LLaMA-3 via Groq API |
| Authentication | JWT |

---

## 📂 Project Structure

```text
Ai-Viva-Quiz-platform/
├── backend/     # FastAPI application (API, auth, database)
├── frontend/    # React + Vite application
└── .gitignore
```

---

## ⚙️ Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Groq](https://console.groq.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/bharat19334/Ai-Viva-Quiz-platform.git
cd Ai-Viva-Quiz-platform
```

### 2. Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=your_neon_postgresql_connection_string
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret_key
```

<!-- VERIFY: replace these variable names with the exact names your code reads (check os.getenv / settings in backend). -->

Start the server:

```bash
uvicorn main:app --reload
```

<!-- VERIFY: replace "main:app" with your actual entry point (for example app.main:app). -->

The API runs at `http://localhost:8000`, and interactive docs are available at `http://localhost:8000/docs`.

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

<!-- VERIFY: if the frontend needs an env file (for example VITE_API_URL), add it here. -->

---

## 🔒 Environment Variables

Never commit your `.env` file. It is listed in `.gitignore`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `GROQ_API_KEY` | API key for the Groq LLM |
| `SECRET_KEY` | Secret used to sign JWT tokens |

---

## 🚧 Roadmap

- [x] User authentication (JWT)
- [ ] Quiz and question APIs
- [ ] Quiz attempt scoring and history
- [ ] Deployment (frontend and backend)

<!-- VERIFY: tick the boxes for anything you have already finished. -->

---

## 📸 Screenshots

<!-- Add 2-3 screenshots here, for example:
![Login](screenshots/login.png)
![Quiz](screenshots/quiz.png)
-->

---

## 👤 Author

**Bharat Goswami**

[![GitHub](https://img.shields.io/badge/GitHub-bharat19334-181717?style=flat-square&logo=github)](https://github.com/bharat19334)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-bharatgoswami19-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/bharatgoswami19)
