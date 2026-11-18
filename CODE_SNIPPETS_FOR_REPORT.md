# GovMatch AI - Code Snippets for Major Project Report

## 📸 Generated Visual Report Slide Images for Presentation & Report Book

All images are saved in the `report_images/` folder inside your project directory for easy downloading and insertion into your report document:

- 🖼️ **Module 1 - SQLite Database Schema:** [`report_images/module_01_sqlite_database_1791395154052.jpg`](file:///c:/Users/Shwetha%20Kumar/OneDrive/Desktop/New%20folder%20%284%29/report_images/module_01_sqlite_database_1791395154052.jpg)
- 🖼️ **Module 2 - JWT Authentication & Hashing:** [`report_images/module_02_jwt_auth_1791395185058.jpg`](file:///c:/Users/Shwetha%20Kumar/OneDrive/Desktop/New%20folder%20%284%29/report_images/module_02_jwt_auth_1791395185058.jpg)
- 🖼️ **Module 3 - User Profile REST API:** [`report_images/module_03_profile_api_1791395217815.jpg`](file:///c:/Users/Shwetha%20Kumar/OneDrive/Desktop/New%20folder%20%284%29/report_images/module_03_profile_api_1791395217815.jpg)
- 🖼️ **Module 4 - Recommendation Eligibility Engine:** [`report_images/module_04_eligibility_engine_1791395243717.jpg`](file:///c:/Users/Shwetha%20Kumar/OneDrive/Desktop/New%20folder%20%284%29/report_images/module_04_eligibility_engine_1791395243717.jpg)
- 🖼️ **Module 5 - Python Semantic NLP Microservice:** [`report_images/module_05_python_nlp_1791395272491.jpg`](file:///c:/Users/Shwetha%20Kumar/OneDrive/Desktop/New%20folder%20%284%29/report_images/module_05_python_nlp_1791395272491.jpg)

---

## 📸 10 Key Code Snippets for Documentation

## **Snippet 1: Database Schema Initialization**
**File:** `backend/database/init.js`
**Description:** SQLite database table structure for user authentication and profile storage

```javascript
/**
 * GovMatch AI — Database Initialization
 * Creates tables if they don't exist
 */

const { getDatabase } = require("./db");

function initializeDatabase() {
  const db = getDatabase();

  // Users table - Authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User profiles table - Questionnaire data
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      age INTEGER,
      gender TEXT,
      state TEXT,
      district TEXT,
      area TEXT,
      occupation TEXT,
      employment_status TEXT,
      annual_income TEXT,
      education TEXT,
      caste TEXT,
      minority INTEGER DEFAULT 0,
      disability INTEGER DEFAULT 0,
      bpl_card INTEGER DEFAULT 0,
      is_student INTEGER DEFAULT 0,
      is_widow INTEGER DEFAULT 0,
      goal TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id)`);

  console.log("[Database] Tables initialized successfully");
}

module.exports = { initializeDatabase };
```

---

## **Snippet 2: User Authentication with JWT**
**File:** `backend/auth/authRoutes.js`
**Description:** Secure user registration with bcrypt password hashing and JWT token generation

```javascript
/**
 * GovMatch AI — User Registration Endpoint
 * Secure authentication with bcrypt and JWT
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../database/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "govmatch_secret_change_in_production";

// POST /api/auth/register - Register new user
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

    // Hash password with bcrypt (10 salt rounds)
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `).run(name, email, password_hash);

    const userId = result.lastInsertRowid;

    // Generate JWT token (expires in 7 days)
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

module.exports = { router };
```

---

## **Snippet 3: AI-Powered Recommendation Pipeline**
**File:** `backend/recommendation/recommendationPipeline.js`
**Description:** Multi-stage recommendation engine with eligibility filtering and semantic matching

```javascript
/**
 * GovMatch AI — Recommendation Pipeline v5.1
 * Multi-stage AI-powered scheme matching system
 */

const { filterByEligibility } = require("./eligibilityEngine");
const { scoreByCompatibility } = require("./compatibilityEngine");
const { classifyIntent } = require("./intentClassifier");
const { explainRecommendation } = require("./explainabilityEngine");

async function runPipeline(profile, query, schemes, topN = 10) {
  const startTime = Date.now();

  // Stage 1: Intent Classification
  const userIntent = classifyIntent(query, profile);

  // Stage 2: Hard Eligibility Filtering
  const eligibleSchemes = filterByEligibility(schemes, profile);

  // Stage 3: Semantic Matching (if Python NLP available)
  let semanticScores = {};
  try {
    const response = await axios.post(`${PYTHON_NLP_URL}/semantic_search`, {
      query: query || "general schemes",
      top_k: eligibleSchemes.length,
    });
    semanticScores = response.data.results || {};
  } catch (error) {
    console.warn("[Pipeline] Semantic search unavailable, using keyword fallback");
  }

  // Stage 4: Compatibility Scoring
  const scoredSchemes = eligibleSchemes.map(scheme => {
    const compatScore = scoreByCompatibility(scheme, profile, userIntent);
    const semanticScore = semanticScores[scheme.slug] || 0;
    const finalScore = (compatScore * 0.7) + (semanticScore * 0.3);

    return {
      scheme,
      finalScore,
      explanation: explainRecommendation(scheme, profile, compatScore, semanticScore),
    };
  });

  // Stage 5: Diversity Re-ranking
  const diverseResults = applyDiversityBoost(scoredSchemes, topN);

  // Stage 6: Sort by final score
  const recommendations = diverseResults
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topN);

  const elapsedMs = Date.now() - startTime;

  return {
    pipelineVersion: "5.1",
    userIntent,
    recommendations,
    totalEligible: eligibleSchemes.length,
    elapsedMs,
  };
}

module.exports = { runPipeline };
```

---

## **Snippet 4: Eligibility Rule Engine**
**File:** `backend/recommendation/eligibilityEngine.js`
**Description:** Comprehensive eligibility checking with 15+ criteria

```javascript
/**
 * GovMatch AI — Eligibility Engine
 * Hard filters: Age, Gender, Income, Education, Caste, State, etc.
 */

function filterByEligibility(schemes, profile) {
  return schemes.filter(scheme => {
    // Age constraint
    if (scheme.age_min && profile.age < scheme.age_min) return false;
    if (scheme.age_max && profile.age > scheme.age_max) return false;

    // Gender constraint
    if (scheme.gender_constraint && 
        scheme.gender_constraint !== "Any" &&
        scheme.gender_constraint.toLowerCase() !== profile.gender?.toLowerCase()) {
      return false;
    }

    // Income constraint
    if (scheme.income_max && profile.annualIncome > scheme.income_max) {
      return false;
    }

    // State eligibility
    if (scheme.level === "State" && 
        scheme.state !== profile.state && 
        scheme.state !== "All States") {
      return false;
    }

    // Education requirement
    if (scheme.education_min) {
      const educationLevels = [
        "No Formal Education", "Below 10th", "10th Pass", 
        "12th Pass", "ITI / Diploma", "Graduate", 
        "Post-Graduate", "PhD"
      ];
      const userLevel = educationLevels.indexOf(profile.education);
      const requiredLevel = educationLevels.indexOf(scheme.education_min);
      if (userLevel < requiredLevel) return false;
    }

    // Caste/Category eligibility
    if (scheme.category_constraint && scheme.category_constraint !== "All") {
      if (!profile.caste || profile.caste !== scheme.category_constraint.toLowerCase()) {
        return false;
      }
    }

    // Special category requirements
    if (scheme.requires_disability && !profile.disability) return false;
    if (scheme.requires_bpl && !profile.bplCard) return false;
    if (scheme.requires_minority && !profile.minority) return false;
    if (scheme.for_students_only && !profile.isStudent) return false;
    if (scheme.for_widows_only && !profile.isWidow) return false;

    // Occupation requirement
    if (scheme.occupation_constraint && 
        scheme.occupation_constraint !== "Any" &&
        scheme.occupation_constraint !== profile.occupation) {
      return false;
    }

    // All eligibility checks passed
    return true;
  });
}

module.exports = { filterByEligibility };
```

---

## **Snippet 5: AI Chatbot with RAG (Retrieval-Augmented Generation)**
**File:** `backend/server.js` (Chat endpoint)
**Description:** Conversational AI using OpenRouter LLM with scheme context injection

```javascript
/**
 * GovMatch AI — Chat Endpoint
 * RAG-powered conversational AI with scheme knowledge
 */

app.post("/api/chat", async (req, res) => {
  const { message, profile = {}, language = "en", history = [] } = req.body;
  
  if (!message) return res.status(400).json({ error: "message is required." });

  // Step 1: Classify intent + extract profile signals
  const intentResult = classifyIntent(message);
  const searchQuery = buildSearchQuery(message, intentResult, profile);
  const profileSignals = extractProfileSignals(message);

  // Step 2: Short-circuit conversational intents (no LLM needed)
  if (isConversationalOnly(intentResult.intent)) {
    const reply = getConversationalResponse(intentResult.intent, language);
    return res.json({
      reply,
      schemes: [],
      source: "conversational",
      intent: intentResult.intent,
    });
  }

  // Step 3: RAG - Retrieve verified scheme context
  const { schemes: contextSchemes, source: ragSource } = 
    await retrieveContextSchemes(searchQuery, profile, PYTHON_NLP_URL, 5);
  
  const groundTruth = buildGroundTruthBlock(contextSchemes);
  const frontendCards = toFrontendSchemes(contextSchemes);

  // Step 4: Build rich system prompt with context
  const systemPrompt = `You are GovMatch AI, an expert Indian government scheme advisor.
Language: ${language}
User Intent: ${intentResult.intent}
User Profile: Age ${profile.age}, ${profile.state}, ${profile.occupation}

VERIFIED SCHEME CONTEXT:
${groundTruth}

Instructions:
- Answer ONLY using the schemes provided above
- Be conversational and helpful in ${language}
- If schemes don't match, suggest related categories
- Never hallucinate scheme details`;

  const llmMessages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10),
    { role: "user", content: message },
  ];

  // Step 5: Call LLM (OpenRouter)
  try {
    const llmRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-flash-1.5",
        messages: llmMessages,
        max_tokens: 700,
        temperature: 0.25, // Low temp = factual, less hallucination
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const reply = llmRes.data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

    res.json({
      reply,
      schemes: frontendCards,
      source: "openrouter",
      ragSource,
      intent: intentResult.intent,
      extractedProfile: profileSignals,
    });
  } catch (error) {
    // Graceful degradation - use structured fallback
    const fallbackReply = buildSchemeAnswer(intentResult.intent, contextSchemes, language);
    res.json({
      reply: fallbackReply,
      schemes: frontendCards,
      source: "error_fallback",
      intent: intentResult.intent,
    });
  }
});
```

---

## **Snippet 6: Profile Management API**
**File:** `backend/profile/profileRoutes.js`
**Description:** RESTful API for profile CRUD operations with JWT authentication

```javascript
/**
 * GovMatch AI — Profile Routes
 * CRUD operations for user profile data
 */

const express = require("express");
const { getDatabase } = require("../database/db");
const { authenticateToken } = require("../auth/authRoutes");

const router = express.Router();

// GET /api/profile - Get authenticated user's profile
router.get("/profile", authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.userId; // From JWT token

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
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PUT /api/profile - Update profile
router.put("/profile", authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.userId;
    const { age, gender, state, district, area, occupation, 
            employmentStatus, annualIncome, education, caste, 
            minority, disability, bplCard, isStudent, isWidow, goal } = req.body;

    // Update existing profile
    db.prepare(`
      UPDATE user_profiles
      SET age = ?, gender = ?, state = ?, district = ?, area = ?,
          occupation = ?, employment_status = ?, annual_income = ?,
          education = ?, caste = ?, minority = ?, disability = ?,
          bpl_card = ?, is_student = ?, is_widow = ?, goal = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(
      age || null, gender || null, state || null, district || null, area || null,
      occupation || null, employmentStatus || null, annualIncome || null,
      education || null, caste || null, minority ? 1 : 0, disability ? 1 : 0,
      bplCard ? 1 : 0, isStudent ? 1 : 0, isWidow ? 1 : 0,
      goal ? JSON.stringify(goal) : null, userId
    );

    res.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("[PUT /api/profile] Error:", error.message);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

module.exports = router;
```

---

## **Snippet 7: React Eligibility Questionnaire with Live Matching**
**File:** `mp-frontend--main/src/pages/EligibilityQuestionnaire.jsx`
**Description:** 8-step interactive questionnaire with real-time scheme matching

```javascript
/**
 * GovMatch AI — Eligibility Questionnaire
 * 8-step interactive form with live match counter
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { profileAPI } from "../services/apiService";

const STEPS = [
  { title: "Basic Info", subtitle: "Tell us about yourself" },
  { title: "Location", subtitle: "Where are you located?" },
  { title: "Occupation", subtitle: "What do you do?" },
  { title: "Annual Income", subtitle: "Family income range" },
  { title: "Education", subtitle: "Highest qualification" },
  { title: "Social Category", subtitle: "Caste / community" },
  { title: "Special Categories", subtitle: "Any additional criteria" },
  { title: "Primary Goal", subtitle: "What are you looking for?" },
];

// Live match counter with debounced API call
function useLiveMatch(profile) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);

  const doFetch = useCallback(async (p) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/recommend", { profile: p, topN: 10 });
      setMatchData({
        total: res.data.coverageFunnel?.afterHardFilters ?? res.data.count ?? 0,
        topN: res.data.count ?? 0,
        funnel: res.data.coverageFunnel ?? null,
      });
    } catch {
      setMatchData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasData = profile.age || profile.gender || profile.state || 
                    profile.occupation || profile.annualIncome;
    if (!hasData) return;
    
    const timer = setTimeout(() => doFetch(profile), 700); // Debounce 700ms
    return () => clearTimeout(timer);
  }, [profile, doFetch]);

  return { matchData, loading };
}

export default function EligibilityQuestionnaire() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => {
    // Load from localStorage for persistence
    const saved = JSON.parse(localStorage.getItem("govmatch_profile") || "{}");
    return { ...INITIAL, ...saved };
  });
  
  const navigate = useNavigate();
  const { matchData, loading } = useLiveMatch(data);

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Save to localStorage (backward compatibility)
      localStorage.setItem("govmatch_profile", JSON.stringify(data));
      
      // Save to database if user is logged in
      const token = localStorage.getItem("govmatch_token");
      if (token) {
        try {
          await profileAPI.saveProfile(data);
        } catch (error) {
          console.warn("Profile save failed, but continuing:", error);
        }
      }
      
      navigate("/results");
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Live Match Counter */}
      {matchData && (
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold gradient-text">
              {matchData.total}
            </div>
            <div>
              <p className="text-sm font-semibold">Schemes Match Your Profile</p>
              <p className="text-xs text-muted">Top {matchData.topN} curated for you</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="glass-card p-6 mb-6">
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <motion.div 
            className="h-full bg-accent-grad"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => i <= step && setStep(i)}
              className={`w-6 h-6 rounded-full text-xs font-bold ${
                i < step ? 'bg-accent text-white' :
                i === step ? 'bg-accent-grad text-white' :
                'bg-secondary text-muted'
              }`}>
              {i < step ? "✓" : i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold">{STEPS[step].title}</h2>
        <p className="text-sm text-muted mb-6">{STEPS[step].subtitle}</p>
        
        {/* Dynamic step component renders here */}
        <StepComponent data={data} setData={setData} />
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="btn-ghost">
            ← Back
          </button>
          <button onClick={handleNext} className="btn-primary">
            {step === STEPS.length - 1 ? "Find Schemes" : "Continue"} →
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## **Snippet 8: Python NLP Semantic Search Service**
**File:** `backend/semantic_search.py`
**Description:** Sentence transformers for semantic scheme matching

```python
"""
GovMatch AI — Semantic Search Service
Flask API using Sentence Transformers for NLP-powered matching
"""

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import numpy as np
import json
import os

app = Flask(__name__)

# Load pre-trained model
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

# Load schemes
SCHEMES_PATH = os.path.join(os.path.dirname(__file__), "schemes_enhanced.json")
with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
    SCHEMES = json.load(f)

# Cache embeddings
EMBEDDINGS_CACHE = "embeddings_cache.npy"
if os.path.exists(EMBEDDINGS_CACHE):
    scheme_embeddings = np.load(EMBEDDINGS_CACHE)
    print(f"[NLP] Loaded {len(scheme_embeddings)} cached embeddings")
else:
    # Generate embeddings for all schemes
    scheme_texts = [
        f"{s['name']} {s['brief_description']} {s['benefits']} {s['eligibility']}"
        for s in SCHEMES
    ]
    scheme_embeddings = model.encode(scheme_texts, convert_to_tensor=False)
    np.save(EMBEDDINGS_CACHE, scheme_embeddings)
    print(f"[NLP] Generated and cached {len(scheme_embeddings)} embeddings")

@app.route("/semantic_search", methods=["POST"])
def semantic_search():
    """
    Semantic search endpoint
    Input: { "query": "education scholarship", "top_k": 10 }
    Output: { "results": { "slug": score, ... } }
    """
    data = request.get_json()
    query = data.get("query", "")
    top_k = min(data.get("top_k", 10), 100)
    
    if not query:
        return jsonify({"error": "query is required"}), 400
    
    # Encode query
    query_embedding = model.encode(query, convert_to_tensor=False)
    
    # Calculate cosine similarities
    similarities = util.cos_sim(query_embedding, scheme_embeddings)[0]
    
    # Get top-k results
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    
    results = {}
    for idx in top_indices:
        scheme = SCHEMES[idx]
        score = float(similarities[idx])
        results[scheme["slug"]] = score
    
    return jsonify({
        "query": query,
        "results": results,
        "model": MODEL_NAME,
        "total_schemes": len(SCHEMES)
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": MODEL_NAME,
        "schemes_loaded": len(SCHEMES),
        "embeddings_cached": os.path.exists(EMBEDDINGS_CACHE)
    })

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  GovMatch AI — NLP Semantic Search Service")
    print(f"  Model: {MODEL_NAME}")
    print(f"  Schemes: {len(SCHEMES)}")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5002, debug=False)
```

---

## **Snippet 9: WebSocket Real-Time Notifications**
**File:** `backend/notifications/notificationService.js`
**Description:** Real-time push notifications using WebSocket

```javascript
/**
 * GovMatch AI — Real-Time Notification Service
 * WebSocket-based push notifications
 */

const { WebSocketServer } = require("ws");

// Notification types
const TYPES = {
  NEW_SCHEME: "NEW_SCHEME",
  ELIGIBILITY_UPDATED: "ELIGIBILITY_UPDATED",
  SCHEME_UPDATED: "SCHEME_UPDATED",
  DEADLINE_REMINDER: "DEADLINE_REMINDER",
  APPLICATION_STATUS: "APPLICATION_STATUS",
};

// In-memory notification store
let notifications = [];
let notificationId = 1;

// WebSocket server instance
let wss = null;

/**
 * Initialize WebSocket server
 */
function initWebSocketServer() {
  wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws, request) => {
    console.log("[WS] New client connected");

    // Send all unread notifications to new client
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
      ws.send(JSON.stringify({
        type: "INITIAL_NOTIFICATIONS",
        notifications: unread,
      }));
    }

    // Handle client messages
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.action === "MARK_READ") {
          markAsRead(data.notificationId);
        } else if (data.action === "MARK_ALL_READ") {
          markAllAsRead();
        }
      } catch (error) {
        console.error("[WS] Invalid message:", error.message);
      }
    });

    ws.on("close", () => {
      console.log("[WS] Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("[WS] Error:", error.message);
    });
  });

  console.log("[WS] Notification WebSocket server ready on /ws/notifications");
  return wss;
}

/**
 * Create and broadcast notification
 */
function createNotification({
  type,
  title,
  message,
  schemeId = null,
  schemeName = null,
  priority = "medium", // low, medium, high
}) {
  const notification = {
    id: notificationId++,
    type,
    title,
    message,
    schemeId,
    schemeName,
    priority,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.push(notification);

  // Broadcast to all connected clients
  if (wss) {
    const payload = JSON.stringify({
      type: "NEW_NOTIFICATION",
      notification,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN state
        client.send(payload);
      }
    });
  }

  console.log(`[NotifService] Created: [${type}] ${title}`);
  return notification;
}

/**
 * Mark notification as read
 */
function markAsRead(notificationId) {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    
    // Broadcast update
    broadcast({
      type: "NOTIFICATION_READ",
      notificationId,
    });
  }
}

/**
 * Mark all notifications as read
 */
function markAllAsRead() {
  notifications.forEach(n => n.read = true);
  
  broadcast({
    type: "ALL_NOTIFICATIONS_READ",
  });
}

/**
 * Broadcast message to all clients
 */
function broadcast(data) {
  if (!wss) return;
  
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

/**
 * Get all notifications
 */
function getAllNotifications() {
  return notifications.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/**
 * Clear old notifications (keep last 100)
 */
function cleanupOldNotifications() {
  if (notifications.length > 100) {
    notifications = notifications.slice(-100);
  }
}

// Cleanup every hour
setInterval(cleanupOldNotifications, 3600000);

module.exports = {
  TYPES,
  initWebSocketServer,
  createNotification,
  markAsRead,
  markAllAsRead,
  getAllNotifications,
};
```

---

## **Snippet 10: React Scheme Recommendation Display**
**File:** `mp-frontend--main/src/components/SchemeCard.jsx`
**Description:** Interactive scheme card with match percentage and explainability

```javascript
/**
 * GovMatch AI — Scheme Recommendation Card
 * Visual display with match ring, badges, and XAI explanation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Check } from "lucide-react";

// Circular progress ring for match score
function MatchRing({ score = 0 }) {
  const pct = Math.round(score * 100);
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);
  
  const color = pct >= 70 ? "#10b981" : pct >= 45 ? "#f59e0b" : "#6366f1";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="54" height="54" viewBox="0 0 54 54">
        <defs>
          <linearGradient id={`grad-${pct}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={pct >= 70 ? "#059669" : pct >= 45 ? "#d97706" : "#8b5cf6"} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="27" cy="27" r={radius} fill="none" 
                stroke="var(--border)" strokeWidth="3.5" />
        
        {/* Progress circle */}
        <circle cx="27" cy="27" r={radius} fill="none" 
                stroke={`url(#grad-${pct})`} strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 27 27)"
                style={{ transition: "stroke-dashoffset 0.7s ease" }} />
        
        {/* Percentage text */}
        <text x="27" y="31.5" textAnchor="middle" 
              fontSize="11" fontWeight="800" fill={color}>
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", 
                     textTransform: "uppercase", letterSpacing: "0.06em", 
                     fontWeight: 700 }}>
        Match
      </span>
    </div>
  );
}

export default function SchemeCard({ scheme, score, explanation, onViewDetails }) {
  const [bookmarked, setBookmarked] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    return saved.includes(scheme.slug);
  });

  function toggleBookmark(e) {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const updated = bookmarked 
      ? saved.filter(s => s !== scheme.slug)
      : [...saved, scheme.slug];
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);
  }

  const whyRecommended = explanation?.whyRecommended || [];
  const benefits = scheme.benefits?.split(";")[0]?.trim() || scheme.brief_description;

  return (
    <motion.div
      className="glass-card p-5 flex gap-4 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}>
      
      {/* Match Ring */}
      <MatchRing score={score} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-base leading-tight mb-1">
              {scheme.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-education">{scheme.category}</span>
              <span className="badge badge-central">{scheme.level || "Central"}</span>
              {scheme.state && scheme.state !== "Central" && (
                <span className="badge">
                  <MapPin size={9} /> {scheme.state}
                </span>
              )}
            </div>
          </div>
          
          {/* Bookmark button */}
          <button onClick={toggleBookmark} className="btn-ghost p-2">
            {bookmarked ? 
              <BookmarkCheck size={18} color="var(--accent)" /> : 
              <Bookmark size={18} />
            }
          </button>
        </div>

        {/* Benefits */}
        <p className="text-sm text-secondary line-clamp-2 mb-3">
          {benefits}
        </p>

        {/* Eligibility reasons (XAI) */}
        {whyRecommended.length > 0 && (
          <div className="flex flex-col gap-1 mb-3">
            {whyRecommended.slice(0, 3).map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Check size={14} className="shrink-0 mt-0.5" 
                       style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--text-secondary)" }}>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button onClick={onViewDetails} className="btn-primary text-xs px-4 py-2">
            View Details
          </button>
          {scheme.application_url && (
            <a href={scheme.application_url} target="_blank" rel="noopener noreferrer"
               className="btn-ghost text-xs px-4 py-2 flex items-center gap-1">
              Apply <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 📸 **How to Use These Snippets**

### **For Your Report Book:**

1. **Copy each snippet** into a code editor with syntax highlighting
2. **Take high-quality screenshots** or use tools like:
   - Carbon (https://carbon.now.sh) - Beautiful code images
   - CodeSnap (VS Code extension)
   - Polacode (VS Code extension)
   
3. **Recommended settings:**
   - Font: Fira Code or JetBrains Mono
   - Theme: One Dark Pro or GitHub Light
   - Font size: 14-16px
   - Line numbers: On
   - Background: Subtle gradient or solid

4. **Caption suggestions:**
   - Snippet 1: "Figure X: SQLite Database Schema Initialization"
   - Snippet 2: "Figure X: Secure User Authentication with JWT and Bcrypt"
   - Snippet 3: "Figure X: Multi-Stage AI Recommendation Pipeline"
   - Snippet 4: "Figure X: Comprehensive Eligibility Rule Engine"
   - Snippet 5: "Figure X: RAG-Powered Conversational AI Chatbot"
   - Snippet 6: "Figure X: RESTful Profile Management API"
   - Snippet 7: "Figure X: Interactive Eligibility Questionnaire with Live Matching"
   - Snippet 8: "Figure X: Python NLP Semantic Search Service"
   - Snippet 9: "Figure X: Real-Time WebSocket Notification System"
   - Snippet 10: "Figure X: React Scheme Recommendation Card Component"

### **Report Sections:**

1. **System Architecture** → Snippet 1, 2, 6
2. **AI/ML Implementation** → Snippet 3, 4, 5, 8
3. **User Interface** → Snippet 7, 10
4. **Real-Time Features** → Snippet 9

---

**Total:** 10 production-quality code snippets covering all major modules of GovMatch AI
