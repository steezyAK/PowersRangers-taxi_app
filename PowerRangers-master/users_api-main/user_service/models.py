from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base 

class User(Base):
    __tablename__='users'

    id=Column(Integer,primary_key=True)
    username=Column(String(50),unique=True,nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password=Column(String(255),nullable=False)

