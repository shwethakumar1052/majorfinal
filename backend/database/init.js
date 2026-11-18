/**
 * GovMatch AI — Database Initialization
 * Creates tables if they don't exist
 */

const { getDatabase } = require("./db");

function initializeDatabase() {
  const db = getDatabase();

  // Users table
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

  // User profiles table
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

  // Create index on email for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);

  // Create index on user_id for faster profile lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id)
  `);

  console.log("[Database] Tables initialized successfully");
}

module.exports = { initializeDatabase };
