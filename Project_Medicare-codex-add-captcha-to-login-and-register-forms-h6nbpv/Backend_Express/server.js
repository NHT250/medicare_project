/**
 * Simple Express server that validates Google reCAPTCHA v2 ("I'm not a robot")
 * tokens and exposes mock authentication endpoints for testing the integration
 * from the React client.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Secret key provided by Google reCAPTCHA Admin Console
const RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY || "6LdpBAEsAAAAAOadjgyMXq1uwKcgOHe6oofFMeWO";

// Allow the React dev server to call this API in development
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: false }));
app.use(express.json());

/**
 * Helper that sends the token to Google's verification endpoint.
 * @param {string} token - Token returned by the reCAPTCHA widget on the client.
 * @param {string} remoteIp - Optional IP address of the user solving the captcha.
 * @returns {Promise<object>} JSON response from Google.
 */
async function verifyCaptchaToken(token, remoteIp) {
  if (!token) {
    return { success: false, "error-codes": ["missing-input-response"] };
  }

  const params = new URLSearchParams();
  params.append("secret", RECAPTCHA_SECRET_KEY);
  params.append("response", token);

  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    throw new Error(`Google reCAPTCHA request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * POST /api/verify-captcha
 * Receives the token from the client, sends it to Google, and returns
 * whether the captcha is valid. This endpoint can be tested with tools
 * like Postman or the provided React forms.
 */
app.post("/api/verify-captcha", async (req, res) => {
  try {
    const { token } = req.body;

    const verification = await verifyCaptchaToken(token, req.ip);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid reCAPTCHA token",
        details: verification["error-codes"] || [],
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("/api/verify-captcha error", error);
    return res.status(500).json({
      success: false,
      error: "Failed to verify reCAPTCHA token",
    });
  }
});

/**
 * POST /api/auth/login
 * Example login endpoint that first validates the captcha token before
 * checking the credentials. Replace the credential check with your own
 * database logic when ready.
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, recaptcha_token: token } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const verification = await verifyCaptchaToken(token, req.ip);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: "reCAPTCHA verification failed",
        details: verification["error-codes"] || [],
      });
    }

    // Demo check: accept a single hard-coded account.
    if (email === "demo@medicare.com" && password === "Password123") {
      return res.json({
        success: true,
        token: "mock-jwt-token",
        user: {
          email,
          name: "Demo User",
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  } catch (error) {
    console.error("/api/auth/login error", error);
    return res.status(500).json({
      success: false,
      error: "Login failed due to a server error",
    });
  }
});

/**
 * POST /api/auth/register
 * Example registration endpoint. It demonstrates how to validate the
 * captcha token before performing any additional business logic.
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, recaptcha_token: token } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    const verification = await verifyCaptchaToken(token, req.ip);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: "reCAPTCHA verification failed",
        details: verification["error-codes"] || [],
      });
    }

    // Demo response - replace with your own persistence logic
    return res.status(201).json({
      success: true,
      user: {
        id: "temporary-user-id",
        email,
        name,
      },
      message: "Registration successful (demo)",
    });
  } catch (error) {
    console.error("/api/auth/register error", error);
    return res.status(500).json({
      success: false,
      error: "Registration failed due to a server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
