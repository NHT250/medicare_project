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
        'role': 'customer',
        'is_banned': False,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    },
    {
        'email': 'admin@medicare.com',
        'password': bcrypt.hashpw('Admin@123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'name': 'Admin User',
        'phone': '0987654321',
        'address': {
            'street': '456 Admin Road',
            'ward': 'Ward 2',
            'district': 'District 3',
            'city': 'Ho Chi Minh City'
        },
        'role': 'admin',
        'is_banned': False,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
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
        'slug': 'paracetamol-500mg',
        'category': 'pain-relief',
        'price': 7.00,
        'discount': 12,
        'stock': 100,
        'images': [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
        ],
        'description': 'Pain relief tablets for headaches and fever with fast-acting ingredients.',
        'specifications': [
            {'key': 'Dosage', 'value': '500mg'},
            {'key': 'Pack Size', 'value': '10 tablets'},
        ],
        'is_active': True,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    },
    {
        'name': 'Vitamin C 1000mg',
        'slug': 'vitamin-c-1000mg',
        'category': 'vitamins',
        'price': 24.99,
        'discount': 0,
        'stock': 75,
        'images': [
            'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80'
        ],
        'description': 'High potency Vitamin C supplement for immune support.',
        'specifications': [
            {'key': 'Serving Size', 'value': '1 tablet'},
            {'key': 'Form', 'value': 'Time release'},
        ],
        'is_active': True,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    },
    {
        'name': 'Omega-3 Fish Oil',
        'slug': 'omega-3-fish-oil',
        'category': 'heart-health',
        'price': 32.99,
        'discount': 15,
        'stock': 50,
        'images': [
            'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80'
        ],
        'description': 'Heart health capsules with essential fatty acids EPA and DHA.',
        'specifications': [
            {'key': 'EPA', 'value': '360mg'},
            {'key': 'DHA', 'value': '240mg'},
        ],
        'is_active': True,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    },
    {
        'name': 'Daily Multivitamin',
        'slug': 'daily-multivitamin',
        'category': 'vitamins',
        'price': 19.99,
        'discount': 5,
        'stock': 60,
        'images': [
            'https://images.unsplash.com/photo-1550572017-edd951aa0b0a?auto=format&fit=crop&w=800&q=80'
        ],
        'description': 'Complete daily nutrition supplement supporting overall wellness.',
        'specifications': [
            {'key': 'Tablets', 'value': '60'},
            {'key': 'Recommended Use', 'value': 'Take 1 tablet daily'},
        ],
        'is_active': True,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
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

