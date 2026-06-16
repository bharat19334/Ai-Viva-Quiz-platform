from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)