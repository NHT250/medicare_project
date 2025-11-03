# MongoDB Seeder for Medicare - Python Version
import pymongo
from pymongo import MongoClient
from datetime import datetime
import bcrypt

# Connect to MongoDB
# For Local MongoDB:
client = MongoClient('mongodb://localhost:27017/')

# For MongoDB Atlas (Cloud):
# client = MongoClient('mongodb+srv://cluster1.qncm65j.mongodb.net/')
db = client['medicare']

# Clear existing data
db.users.delete_many({})
db.products.delete_many({})
db.categories.delete_many({})

print('🗑️  Cleared existing data...')

# Sample Users
sample_users = [
    {
        'email': 'user@example.com',
        'password': bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'name': 'John Doe',
        'phone': '0123456789',
        'address': {
            'street': '123 Main Street',
            'ward': 'Ward 1',
            'district': 'District 1',
            'city': 'Ho Chi Minh City'
        },
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    },
    {
        'email': 'admin@medicare.com',
        'password': bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'name': 'Admin User',
        'phone': '0987654321',
        'address': {
            'street': '456 Admin Road',
            'ward': 'Ward 2',
            'district': 'District 3',
            'city': 'Ho Chi Minh City'
        },
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    }
]

# Sample Categories
sample_categories = [
    {
        'name': 'Pain Relief',
        'description': 'Medications for pain management',
        'icon': 'fas fa-pills',
        'slug': 'pain-relief',
        'createdAt': datetime.now()
    },
    {
        'name': 'Vitamins',
        'description': 'Vitamin and mineral supplements',
        'icon': 'fas fa-leaf',
        'slug': 'vitamins',
        'createdAt': datetime.now()
    },
    {
        'name': 'Skin Care',
        'description': 'Products for skin health',
        'icon': 'fas fa-hand-sparkles',
        'slug': 'skin-care',
        'createdAt': datetime.now()
    },
    {
        'name': 'Heart Health',
        'description': 'Medications for cardiovascular health',
        'icon': 'fas fa-heartbeat',
        'slug': 'heart-health',
        'createdAt': datetime.now()
    },
    {
        'name': 'Mental Health',
        'description': 'Medications for mental wellbeing',
        'icon': 'fas fa-brain',
        'slug': 'mental-health',
        'createdAt': datetime.now()
    },
    {
        'name': 'Respiratory',
        'description': 'Medications for breathing and lung health',
        'icon': 'fas fa-lungs',
        'slug': 'respiratory',
        'createdAt': datetime.now()
    }
]

# Sample Products
sample_products = [
    {
        'name': 'Paracetamol 500mg',
        'description': 'Pain relief tablets for headaches and fever',
        'price': 7.00,
        'oldPrice': 8.00,
        'image': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
        'category': 'pain-relief',
        'subcategory': 'fever',
        'stock': 100,
        'inStock': True,
        'rating': 4.8,
        'reviews': 124,
        'ingredients': ['Paracetamol 500mg'],
        'usage': 'Take 1-2 tablets every 4-6 hours',
        'sideEffects': 'May cause nausea in some cases',
        'warnings': 'Do not exceed recommended dose',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    },
    {
        'name': 'Vitamin C 1000mg',
        'description': 'Immune support supplement',
        'price': 24.99,
        'oldPrice': None,
        'image': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
        'category': 'vitamins',
        'subcategory': 'immune',
        'stock': 75,
        'inStock': True,
        'rating': 4.5,
        'reviews': 89,
        'ingredients': ['Vitamin C 1000mg', 'Bioflavonoids'],
        'usage': 'Take 1 tablet daily with meals',
        'sideEffects': 'May cause diarrhea if taken in excess',
        'warnings': 'Store in cool, dry place',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    },
    {
        'name': 'Omega-3 Fish Oil',
        'description': 'Heart health capsules with essential fatty acids',
        'price': 32.99,
        'oldPrice': 39.99,
        'image': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88',
        'category': 'heart-health',
        'subcategory': 'cardiovascular',
        'stock': 50,
        'inStock': True,
        'rating': 4.9,
        'reviews': 156,
        'ingredients': ['Omega-3 1000mg', 'EPA', 'DHA'],
        'usage': 'Take 1-2 capsules with meals',
        'sideEffects': 'Fishy aftertaste may occur',
        'warnings': 'If you have a fish allergy, do not use',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    },
    {
        'name': 'Daily Multivitamin',
        'description': 'Complete daily nutrition supplement',
        'price': 19.99,
        'oldPrice': None,
        'image': 'https://images.unsplash.com/photo-1550572017-edd951aa0b0a',
        'category': 'vitamins',
        'subcategory': 'general',
        'stock': 60,
        'inStock': True,
        'rating': 4.7,
        'reviews': 203,
        'ingredients': ['Vitamin A', 'Vitamin B complex', 'Vitamin C', 'Vitamin D', 'Minerals'],
        'usage': 'Take 1 tablet daily with breakfast',
        'sideEffects': 'None reported',
        'warnings': 'Keep out of reach of children',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    }
]

# Insert data
db.users.insert_many(sample_users)
print('✅ Inserted users')

db.categories.insert_many(sample_categories)
print('✅ Inserted categories')

db.products.insert_many(sample_products)
print('✅ Inserted products')

print('\n🎉 Database seeding completed successfully!')
print('Database: medicare')
print('Collections: users, products, categories')

client.close()

