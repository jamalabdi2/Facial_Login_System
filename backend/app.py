from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import face_recognition
from flask_cors import CORS
from pymongo import MongoClient
from settings import Config
from bson import ObjectId

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])
app.config.from_object(Config)

# MongoDB
mongo_uri = app.config['MONGO_URI']
print(f'Connecting to MongoDB at: {mongo_uri}')
mongo_client = MongoClient(mongo_uri)

# Check if the connection is established by listing databases
try:
    mongo_client.admin.command('ping')
    print('MongoDB connection established.')
except Exception as e:
    print(f'Error connecting to MongoDB: {e}')

db = mongo_client.face_recognition
students_collection = db.students
print('Using collection "students".')

def get_face_encodings(img):
    rgb_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face_encodings = face_recognition.face_encodings(rgb_image)
    return face_encodings[0] if face_encodings else None

def encode_image_to_base64(image_array):
    return base64.b64encode(image_array.tobytes()).decode('utf-8')

def decode_image_from_base64(encoded_image):
    return np.frombuffer(base64.b64decode(encoded_image.encode('utf-8')), dtype=np.float64)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data['email']
        username = data['username']
        image = data['image']

        # Check if a student with the given email already exists
        existing_student = students_collection.find_one({'email': email})
        if existing_student:
            return jsonify({'message': 'Email already registered'}), 400

        image_data = base64.b64decode(image.split(',')[1])
        np_image = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        face_encodings = get_face_encodings(img)
        if face_encodings is not None:
            base64_face_encoding = encode_image_to_base64(face_encodings)
            student_information = {
                'email': email,
                'username': username,
                'face_encoding': base64_face_encoding
            }
            result = students_collection.insert_one(student_information)
            print(f'Student registered with ID: {result.inserted_id}')
            return jsonify({'message': 'Student registered successfully', 'student_id': str(result.inserted_id)})
        else:
            print('No face encodings found')
            return jsonify({'message': 'Failed to register student'}), 400
    except Exception as e:
        print(f'Error during registration: {str(e)}')
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        image = data['image']

        image_data = base64.b64decode(image.split(',')[1])
        np_img = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        encoding = get_face_encodings(img)

        if encoding is not None:
            students = students_collection.find()
            for student in students:
                stored_encoding = decode_image_from_base64(student['face_encoding'])
                if face_recognition.compare_faces([stored_encoding], encoding)[0]:
                    print(f'Student recognized: {student["username"]}')
                    return jsonify({
                        'message': 'Student recognized',
                        'username': student['username'],
                        'student_id': str(student['_id'])
                    })
            print('Student not recognized')
            return jsonify({'message': 'Student not recognized'}), 401
        else:
            print('No face encoding found in the provided image')
            return jsonify({'message': 'Failed to recognize student'}), 400
    except Exception as e:
        print(f'Error during login: {str(e)}')
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

@app.route('/greeting', methods=['GET'])
def greeting():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({'message': 'Student ID is required'}), 400
    try:
        student = students_collection.find_one({'_id': ObjectId(student_id)})
        if student:
            return jsonify({'username': student['username']})
        else:
            return jsonify({'message': 'Student not found'}), 404
    except Exception as e:
        print(f'Error during greeting: {str(e)}')
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
