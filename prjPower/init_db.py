from models import init_db

# Initialiser la base de données
if __name__ == '__main__':
    init_db()
    print("Les tables ont été créées avec succès dans la base de données PostgreSQL.")
