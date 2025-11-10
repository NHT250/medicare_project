# Configuration file for Medicare Backend
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    # For Local MongoDB:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    # For MongoDB Atlas:
    # MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://cluster1.qncm65j.mongodb.net/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'medicare')

    # JWT Secret Key
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_DELTA = 86400  # 24 hours

    # reCAPTCHA Configuration
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')

    if not JWT_SECRET_KEY or not RECAPTCHA_SECRET_KEY:
        raise RuntimeError('Missing secrets in environment variables')
    
    # Flask Configuration
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # CORS Configuration
    CORS_ORIGINS = [
        'http://localhost:3000',      # Old frontend
        'http://127.0.0.1:5500',      # Live Server
        'http://localhost:5500',      # Live Server
        'http://localhost:5173',      # Vite (React)
        'http://127.0.0.1:5173'       # Vite (React)
    ]

