/**
 * Database Inspection Script
 * Run with: node inspect_db.js
 */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "data/govmatch.db");
const db = new Database(DB_PATH, { readonly: true });

console.log("\n" + "=".repeat(60));
console.log("  GovMatch AI - Database Inspector");
console.log("  Database: " + DB_PATH);
console.log("=".repeat(60) + "\n");

// Show tables
console.log("📊 TABLES:");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(`   - ${t.name}`));

// Show indexes
console.log("\n📑 INDEXES:");
const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all();
indexes.forEach(i => console.log(`   - ${i.name}`));

// Count users
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
console.log("\n👥 USERS:");
console.log(`   Total: ${userCount.count}`);

if (userCount.count > 0) {
  console.log("\n   Recent users:");
  const users = db.prepare("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5").all();
  users.forEach(u => {
    console.log(`   ${u.id}. ${u.name} (${u.email}) - Created: ${u.created_at}`);
  });
}

// Count profiles
const profileCount = db.prepare("SELECT COUNT(*) as count FROM user_profiles").get();
console.log("\n📝 PROFILES:");
console.log(`   Total: ${profileCount.count}`);

if (profileCount.count > 0) {
  console.log("\n   Profile details:");
  const profiles = db.prepare(`
    SELECT p.user_id, u.name, p.age, p.gender, p.state, p.occupation, p.education
    FROM user_profiles p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT 5
  `).all();
  
  profiles.forEach(p => {
    console.log(`   User: ${p.name}`);
    console.log(`     Age: ${p.age}, Gender: ${p.gender}`);
    console.log(`     State: ${p.state}, Occupation: ${p.occupation}`);
    console.log(`     Education: ${p.education}`);
    console.log();
  });
}

// Show schema
console.log("\n📋 USERS TABLE SCHEMA:");
const userSchema = db.prepare("PRAGMA table_info(users)").all();
userSchema.forEach(col => {
  console.log(`   ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
});

console.log("\n📋 USER_PROFILES TABLE SCHEMA:");
const profileSchema = db.prepare("PRAGMA table_info(user_profiles)").all();
profileSchema.forEach(col => {
  console.log(`   ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
});

// Database size
const stats = db.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get();
console.log(`\n💾 DATABASE SIZE: ${(stats.size / 1024).toFixed(2)} KB`);

console.log("\n" + "=".repeat(60) + "\n");

db.close();
