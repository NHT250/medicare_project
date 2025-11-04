# Medicare Project Monorepo

This repository groups the different services that make up the Medicare application into a single, organized structure.

## 📁 Repository Layout

```
backend/
├── flask_app/      # Python + Flask API and MongoDB seed scripts
└── express_api/    # Node.js Express service for reCAPTCHA validation
frontend/
└── react-app/      # React (Vite) client application
```

## 🔧 Getting Started

Each project keeps its own setup instructions inside the respective directory. Navigate into the service you want to run and follow its README or documentation files.

```
# Flask API
cd backend/flask_app
pip install -r requirements.txt
python app.py

# Express API
cd backend/express_api
npm install
npm run dev

# React client
cd frontend/react-app
npm install
npm run dev
```

## 📝 Notes

- Environment-specific files (for example `.env`) are intentionally ignored by Git. Copy the sample configuration provided in each project when deploying.
- The repository-level `.gitignore` already excludes transient folders such as `node_modules/` and Python virtual environments.

