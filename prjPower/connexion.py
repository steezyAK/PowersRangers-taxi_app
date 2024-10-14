#capture video et traitement dimages
import cv2 
#reconnaissance faciale
import face_recognition
from models import session, Utilisateur
#pour les encodages faciaux
import numpy as np
from sqlalchemy.exc import SQLAlchemyError
from inscription import extract_face_encoding


#capturer le visage du user
def capture_face():
    #ouvrir la cam par defaut
    cap= cv2.VideoCapture(0)
    while True:
        #capturer une img de la cam
        success, img = cap.read()
        if success:
            #afficher limg capturee
            cv2.imshow('Capturer le visage pour inscription', img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    #fermer la cam
    cap.release()
    #fermer toutes les fenetres ouvertes
    cv2.destroyAllWindows()
    return img

#fct pour recuperer les encodages faciaux depuis la bd
def get_user_face_encoding(name):
    try:
        user = session.query(Utilisateur).filter_by(nom=name).first()
        if user is None:
            return None
        return np.frombuffer(user.face_encoding, dtype='float64')
    except SQLAlchemyError as e:
        print(f"Erreur lors de la récupération des données : {e}")
        return None
    finally:
        session.close()
    
#fct pour comparer le visage capture
def compare_face(name):
    #recuperer les encodages depuis la bd
    stored_encoding = get_user_face_encoding(name)
    if stored_encoding is None:
        return f"Erreur : Aucun utilisateur nommé {name} n'a été trouvé"
    
    #capturer le visage pour la connexion
    user_image = capture_face()
    user_encoding = extract_face_encoding(user_image)
    if user_encoding is None:
        return "Erreur : Aucun visage n'a été détecté. Veuillez réessayer"
    
    #comparer les encodages
    matches= face_recognition.compare_faces([stored_encoding], user_encoding)
    face_distances = face_recognition.face_distance([stored_encoding], user_encoding)
    #trouver lindice du visage le plus proche
    min_distance_index = np.argmin(face_distances)

    if matches[min_distance_index]:
        return f"Connexion réussie : Bienvenue {name}!"
    else:
        return "Visage non reconnu."
    
#fct pour la connexion
def connexion():
    #demander le nom du user 
    username = input("Veuillez saisir votre nom d'utilisateur pour la connexion : ")
    #com^parer avec les encodages dans la bd
    result = compare_face(username)
    #afficher le resultat de la comparaison
    print(result)

#ex
if __name__ == "__main__":
    connexion()
