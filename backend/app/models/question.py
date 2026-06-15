
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    question_text = Column(Text, nullable=False)
    expected_answer = Column(Text, nullable=False)
    difficulty = Column(String, default="medium")