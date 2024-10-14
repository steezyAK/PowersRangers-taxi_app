from sqlalchemy import create_engine, Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import psycopg2


load_dotenv()

# Charger les variables d'environnement depuis un fichier .env
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:admin@localhost/FaceRecognitionDb')

# Créer l'instance de moteur SQLAlchemy
engine = create_engine(os.getenv("DATABASE_URL"), echo=True, connect_args={"options": "-c client_encoding=utf8"})





# Déclarer la base
Base = declarative_base()

# Définir le modèle utilisateur
class Utilisateur(Base):
    __tablename__ = 'utilisateurs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    face_encoding = Column(LargeBinary, nullable=False)  # Stocker l'encodage du visage en tant que données binaires

# Créer toutes les tables dans la base de données
def init_db():
    Base.metadata.create_all(engine)

# Créer une session pour interagir avec la base de données
Session = sessionmaker(bind=engine)
session = Session()

