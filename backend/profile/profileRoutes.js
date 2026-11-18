/**
 * GovMatch AI — Profile Routes
 * /api/profile (GET, POST, PUT)
 */

const express = require("express");
const { getDatabase } = require("../database/db");
const { authenticateToken } = require("../auth/authRoutes");

const router = express.Router();

// ── GET /api/profile ────────────────────────────────────────────────────────
// Returns the authenticated user's profile
router.get("/profile", authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.userId;

    // Get user info
    const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get profile info
    const profile = db.prepare("SELECT * FROM user_profiles WHERE user_id = ?").get(userId);

    res.json({
      user,
      profile: profile ? {
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        district: profile.district,
        area: profile.area,
        occupation: profile.occupation,
        employmentStatus: profile.employment_status,
        annualIncome: profile.annual_income,
        education: profile.education,
        caste: profile.caste,
        minority: Boolean(profile.minority),
        disability: Boolean(profile.disability),
        bplCard: Boolean(profile.bpl_card),
        isStudent: Boolean(profile.is_student),
        isWidow: Boolean(profile.is_widow),
        goal: profile.goal ? JSON.parse(profile.goal) : [],
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      } : null,
    });
  } catch (error) {
    console.error("[GET /api/profile] Error:", error.message);
    res.status(500).json({ error: "Failed to fetch profile.", detail: error.message });
  }
});

// ── POST /api/profile ───────────────────────────────────────────────────────
// Creates a new profile for the authenticated user
router.post("/profile", authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.userId;
    const {
      age, gender, state, district, area,
      occupation, employmentStatus, annualIncome,
      education, caste, minority, disability,
      bplCard, isStudent, isWidow, goal
    } = req.body;

    // Check if profile already exists
    const existing = db.prepare("SELECT id FROM user_profiles WHERE user_id = ?").get(userId);
    if (existing) {
      return res.status(409).json({ error: "Profile already exists. Use PUT to update." });
    }

    // Insert profile
    const result = db.prepare(`
      INSERT INTO user_profiles (
        user_id, age, gender, state, district, area,
        occupation, employment_status, annual_income,
        education, caste, minority, disability,
        bpl_card, is_student, is_widow, goal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      age || null,
      gender || null,
      state || null,
      district || null,
      area || null,
      occupation || null,
      employmentStatus || null,
      annualIncome || null,
      education || null,
      caste || null,
      minority ? 1 : 0,
      disability ? 1 : 0,
      bplCard ? 1 : 0,
      isStudent ? 1 : 0,
      isWidow ? 1 : 0,
      goal ? JSON.stringify(goal) : null
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profileId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("[POST /api/profile] Error:", error.message);
    res.status(500).json({ error: "Failed to create profile.", detail: error.message });
  }
});

// ── PUT /api/profile ────────────────────────────────────────────────────────
// Updates the authenticated user's profile
router.put("/profile", authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.userId;
    const {
      age, gender, state, district, area,
      occupation, employmentStatus, annualIncome,
      education, caste, minority, disability,
      bplCard, isStudent, isWidow, goal
    } = req.body;

    // Check if profile exists
    const existing = db.prepare("SELECT id FROM user_profiles WHERE user_id = ?").get(userId);
    
    if (!existing) {
      // Create new profile if it doesn't exist
      const result = db.prepare(`
        INSERT INTO user_profiles (
          user_id, age, gender, state, district, area,
          occupation, employment_status, annual_income,
          education, caste, minority, disability,
          bpl_card, is_student, is_widow, goal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        age || null,
        gender || null,
        state || null,
        district || null,
        area || null,
        occupation || null,
        employmentStatus || null,
        annualIncome || null,
        education || null,
        caste || null,
        minority ? 1 : 0,
        disability ? 1 : 0,
        bplCard ? 1 : 0,
        isStudent ? 1 : 0,
        isWidow ? 1 : 0,
        goal ? JSON.stringify(goal) : null
      );

      return res.json({
        success: true,
        message: "Profile created successfully.",
        profileId: result.lastInsertRowid,
      });
    }

    // Update existing profile
    db.prepare(`
      UPDATE user_profiles
      SET age = ?,
          gender = ?,
          state = ?,
          district = ?,
          area = ?,
          occupation = ?,
          employment_status = ?,
          annual_income = ?,
          education = ?,
          caste = ?,
          minority = ?,
          disability = ?,
          bpl_card = ?,
          is_student = ?,
          is_widow = ?,
          goal = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(
      age || null,
      gender || null,
      state || null,
      district || null,
      area || null,
      occupation || null,
      employmentStatus || null,
      annualIncome || null,
      education || null,
      caste || null,
      minority ? 1 : 0,
      disability ? 1 : 0,
      bplCard ? 1 : 0,
      isStudent ? 1 : 0,
      isWidow ? 1 : 0,
      goal ? JSON.stringify(goal) : null,
      userId
    );

    res.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("[PUT /api/profile] Error:", error.message);
    res.status(500).json({ error: "Failed to update profile.", detail: error.message });
  }
});

module.exports = router;
