
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.question import Question
from app.models.course import Course
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import generate_questions
import os

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/upload-pdf/{course_id}")
async def upload_pdf(course_id: int, num_questions: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course nahi mila!")
    pdf_path = f"uploads/{file.filename}"
    with open(pdf_path, "wb") as f:
        f.write(await file.read())
    text = extract_text_from_pdf(pdf_path)
    questions = await generate_questions(text, num_questions)
    for q in questions:
        question = Question(
            course_id=course_id,
            question_text=q["question"],
            expected_answer=q["answer"],
            difficulty=q.get("difficulty", "medium")
        )
        db.add(question)
    db.commit()
    os.remove(pdf_path)
    return {"message": f"{len(questions)} questions ban gaye!"}

@router.get("/questions/{course_id}")
def get_questions(course_id: int, db: Session = Depends(get_db)):
    return db.query(Question).filter(Question.course_id == course_id).all()