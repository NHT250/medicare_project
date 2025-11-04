# Medicare Express Backend (Demo)

This lightweight Express server demonstrates how to validate Google reCAPTCHA v2
checkbox tokens before processing login or registration requests. It pairs with
the React login/register form provided in this project.

## Getting started

```bash
cd Backend_Express
cp .env.example .env         # update the secret key if necessary
npm install
npm run start                # or: npm run dev
```

The server starts on `http://localhost:5000` by default and exposes:

- `POST /api/verify-captcha` – verifies the reCAPTCHA token only.
- `POST /api/auth/login` – demo login that checks the captcha and hard-coded
  credentials (`demo@medicare.com` / `Password123`).
- `POST /api/auth/register` – demo registration that accepts the captcha token
  and returns a mock user object.

Replace the sample logic with real database operations when you are ready to
store users.
