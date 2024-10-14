from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
from datetime import datetime

class User(Base):
    __tablename__='users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=True)  # for email/password signups
    uid = Column(String(500), nullable=True)  # for Google signups
    email_verified = Column(Boolean, default=False)  # Track if email is verified
    created_at = Column(DateTime, default=datetime.utcnow)  # When the user registered

    # i wiil add the database cleaning script later where i delete all the non-verified emails 
    