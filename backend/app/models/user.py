from sqlalchemy import Column, Integer, String, Enum
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum("superadmin", "teacher", "student", name="user_role"), nullable=False)
    branch = Column(String, nullable=True)
    course = Column(String, nullable=True)