/**
 * GovMatch AI — Authentication Routes
 * /api/auth/register, /api/auth/login
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../database/db");

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "govmatch_secret_change_in_production";

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const db = getDatabase();

    // Check if email already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `).run(name, email, password_hash);

    const userId = result.lastInsertRowid;

    // Generate JWT token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });

    // Return user data (without password)
    const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(userId);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("[/api/auth/register] Error:", error.message);
    res.status(500).json({ error: "Registration failed.", detail: error.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const db = getDatabase();

    // Find user by email
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    // Return user data (without password)
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        created_at: safeUser.created_at,
      },
    });
  } catch (error) {
    console.error("[/api/auth/login] Error:", error.message);
    res.status(500).json({ error: "Login failed.", detail: error.message });
  }
});

// ── Middleware: Verify JWT token ────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  });
}

module.exports = { router, authenticateToken };
