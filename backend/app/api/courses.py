from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.course import Course
from app.models.user import User

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/create")
def create_course(name: str, branch: str, teacher_id: int, subject: str = None, semester: int = None, db: Session = Depends(get_db)):
    teacher = db.query(User).filter(User.id == teacher_id, User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher nahi mila!")
    course = Course(name=name, branch=branch, teacher_id=teacher_id, subject=subject, semester=semester)
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"message": "Course ban gaya!", "course_id": course.id}

@router.get("/all")
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/teacher/{teacher_id}")
def get_teacher_courses(teacher_id: int, db: Session = Depends(get_db)):
    return db.query(Course).filter(Course.teacher_id == teacher_id).all()

@router.get("/filter")
def filter_courses(branch: str, db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.branch == branch).all()
    return courses