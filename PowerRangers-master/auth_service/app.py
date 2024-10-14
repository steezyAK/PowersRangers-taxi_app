from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager,create_access_token
from werkzeug.security import generate_password_hash,check_password_hash
from models import User
from database import db_session
import os
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')

jwt = JWTManager(app)
CORS(app, origins=["http://localhost:5173"])

# Ajout de la route pour la page d'accueil
@app.route('/')
def home():
    return "Welcome to the Authentication API!"


# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////

# // the sign up route

# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
@app.route('/auth/register', methods=['POST'])
def register():
	try:
		data = request.get_json()
		print(f"Received data: {data}")  # Debug line to check what is received
		if data['provider'] == "google" :
			try:
				email = data.get('email')
				username = data.get('username')
				uid = data.get('uid')
				email_verified = data.get('email_verified')

				# hashed_password = generate_password_hash(password)

				user = User(email=email, username=username, uid=uid, email_verified=email_verified)
				
				db_session.add(user)
				db_session.commit()

				return jsonify({"message": "User registered successfully"}),201
			except Exception as e:
					return jsonify({"error": str(e)}), 500
                     
		elif data['provider'] == "email/password":
			try:
					email = data.get('email')
					username = data.get('username')
					password = data.get('password')
					email_verified = data.get('email_verified')
					uid = data.get('uid')

					hashed_password = generate_password_hash(password)

					user = User(email=email, username=username,password=hashed_password,email_verified=email_verified, uid=uid)
					

					db_session.add(user)
					db_session.commit()

					return jsonify({"message": "User registered successfully"}),201
			except Exception as e:
				return jsonify({"error": str(e)}), 500
			
	except Exception as e:
			return jsonify({"error": str(e)}), 500


# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////

# // the login route

# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
# // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
@app.route('/auth/login', methods=['POST'])
def login():
	print(f"We in wouuhououu")
	data = request.get_json()
	print(f"inside the login func {data}")
	
	try:
		if data['provider'] == "google":
			email = data.get('email')
			uid = data.get('uid')



			# Recherche l'utilisateur par email
			user = db_session.query(User).filter_by(email=email).first()

			if not user :
				return jsonify({"error":"No user was found with the given email !"})
			
			if uid != user.uid:
				return jsonify({"error":"The uid was not coorect !"})
			
			return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "email_verified": user.email_verified,
            "message": "Login was successful"
        }), 200
		

		elif data['provider'] == "email/password":
			
			email = data.get('email')
			password = data.get('password')

			# Recherche l'utilisateur par email
			user = db_session.query(User).filter_by(email=email).first()

			# check if the user existes email and password check
			if not user:
				return jsonify({"error": "No user was found with the given email !"}), 404
			if not check_password_hash(user.password, password):
				return jsonify({"error": "wrong password"}), 400
			# turn the user.email_veified from false to true if it's his first time logging in 
			if not user.email_verified:
				user.email_verified = True
				db_session.commit()

			# send the user information to the frontend

			return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "email_verified": user.email_verified,
            "message": "Login was successful"
        }), 200
		
	except Exception as e:
		return jsonify({"error": str(e)}), 500 
	
 

if __name__ == '__main__':
    app.run(debug=True,port=5000)


