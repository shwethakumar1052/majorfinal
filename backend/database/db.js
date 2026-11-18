/**
 * GovMatch AI — SQLite Database Connection
 * Persistent user and profile storage
 */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/govmatch.db");

// Create database connection
let db = null;

function getDatabase() {
  if (!db) {
    // Ensure data directory exists
    const fs = require("fs");
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Connect to SQLite database
    db = new Database(DB_PATH, { verbose: console.log });
    db.pragma("journal_mode = WAL"); // Write-Ahead Logging for better concurrency
    console.log(`[Database] Connected to SQLite at: ${DB_PATH}`);
  }
  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log("[Database] Connection closed");
  }
}

module.exports = {
  getDatabase,
  closeDatabase,
};
