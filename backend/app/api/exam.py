
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.session import ExamSession
from app.models.question import Question
from app.services.ai_service import evaluate_answer
from app.models.user import User
from app.models.course import Course

router = APIRouter(prefix="/exam", tags=["Exam"])

@router.post("/start")
def start_exam(student_id: int, course_id: int, exam_type: str, db: Session = Depends(get_db)):
    session = ExamSession(student_id=student_id, course_id=course_id, exam_type=exam_type)
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session_id": session.id, "message": "Exam shuru ho gaya!"}

@router.get("/questions/{course_id}")
def get_exam_questions(course_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.course_id == course_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Koi question nahi mila!")
    return questions

@router.post("/submit-answer")
async def submit_answer(session_id: int, question_id: int, student_answer: str, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question nahi mila!")
    result = await evaluate_answer(
        question=question.question_text,
        expected=question.expected_answer,
        student_answer=student_answer
    )
    return result

@router.post("/complete/{session_id}")
def complete_exam(session_id: int, final_score: int, db: Session = Depends(get_db)):
    session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session nahi mila!")
    session.completed = True
    session.score = final_score
    db.commit()
    return {"message": "Exam complete!", "score": final_score}

@router.get("/results/{student_id}")
def get_student_results(student_id: int, db: Session = Depends(get_db)):
    sessions = db.query(ExamSession).filter(ExamSession.student_id == student_id).all()
    result = []
    for s in sessions:
        course = db.query(Course).filter(Course.id == s.course_id).first()
        result.append({
            "id": s.id,
            "course_name": course.name if course else "Unknown",
            "branch": course.branch if course else "",
            "exam_type": s.exam_type,
            "started_at": s.started_at,
            "completed": s.completed,
            "score": s.score,
            "face_flagged": s.face_flagged,
            "voice_flagged": s.voice_flagged
        })
    return result

@router.get("/course-results/{course_id}")
def get_course_results(course_id: int, db: Session = Depends(get_db)):
    sessions = db.query(ExamSession).filter(ExamSession.course_id == course_id).all()
    result = []
    for s in sessions:
        student = db.query(User).filter(User.id == s.student_id).first()
        result.append({
            "id": s.id,
            "student_name": student.name if student else "Unknown",
            "student_email": student.email if student else "",
            "exam_type": s.exam_type,
            "started_at": s.started_at,
            "completed": s.completed,
            "score": s.score,
            "face_flagged": s.face_flagged,
            "voice_flagged": s.voice_flagged
        })
    return result