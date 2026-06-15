
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    exam_type = Column(String)
    started_at = Column(DateTime, server_default=func.now())
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    face_flagged = Column(Boolean, default=False)
    voice_flagged = Column(Boolean, default=False)