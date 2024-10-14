#capture video et traitement dimages
import cv2 
#reconnaissance faciale
import face_recognition
#pour les encodages faciaux
import numpy as np
from models import session, Utilisateur
#pour se connectera la bd postegreSql
from sqlalchemy.exc import SQLAlchemyError

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
            print("Appuyez sur 'q' pour capturer l'image...")
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    #fermer la cam
    cap.release()
    #fermer toutes les fenetres ouvertes
    cv2.destroyAllWindows()
    return img

#fct pour extraire les encodages faciaux dune umg capturee
def extract_face_encoding(image):
    #reduire la taille pour accelerer le traitement
    small_image = cv2.resize(image, (0, 0), fx=0.25, fy=0.25)
    #convertir en rgb
    small_image_rgb = cv2.cvtColor(small_image, cv2.COLOR_BGR2RGB)
    #extraireles encodages faciaux
    encodings = face_recognition.face_encodings(small_image_rgb)
    if len(encodings) > 0 :
        #retourne le premier encoage sil ya un visage detecte
        return encodings[0]
    else:
        #Aucun visage detecte
        return None 
    
#fct pour sauvegarder les encodages faciaux
def save_face_encoding(name, face_encoding):
    try:
        # Convertir l'encodage en bytes pour l'enregistrement
        user = Utilisateur(nom=name, face_encoding=face_encoding.tobytes())
        session.add(user)
        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Erreur lors de l'insertion dans la base de données : {e}")
    finally:
        session.close()

#fct pour inscription
def inscription(name):
    #capture le viage du user
    user_image = capture_face()
    #extraire les encodages faciaux
    user_encoding = extract_face_encoding(user_image)

    if user_encoding is not None: 
        #sauvegarder lencodage dans la bd
        save_face_encoding(name, user_encoding)
        print(f"L'utulisateur {name} a été inscrit avec succès.")
    else: 
        print("Erreur: Aucun visage détecté. Veuillez réessayer.")

# ex
if __name__ == "__main__":
    username = input("Veuillez saisir le nom d'utilisateur pour l'inscription : ")
    inscription(username)

