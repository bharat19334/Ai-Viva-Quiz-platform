from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.models import user, course, question, session
from app.api import auth, courses, quiz, exam, results

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Assessment Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(quiz.router)
app.include_router(exam.router)
app.include_router(results.router)

@app.get("/")
def root():
    return {"message": "AI Assessment Platform API is running!"}