from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from passlib.context import CryptContext
from jose import jwt
import os

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET")

@router.post("/register")
def register(name: str, email: str, password: str, role: str, student_id: str = None, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_context.hash(password[:72])
    user = User(name=name, email=email, password=hashed, role=role, student_id=student_id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered!", "user_id": user.id}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password[:72], user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"user_id": user.id, "role": user.role}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "role": user.role, "name": user.name, "user_id": user.id}

@router.get("/teachers")
def get_teachers(db: Session = Depends(get_db)):
    teachers = db.query(User).filter(User.role == "teacher").all()
    return [{"name": t.name, "email": t.email, "id": t.id} for t in teachers]