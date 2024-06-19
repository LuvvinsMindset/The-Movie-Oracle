// db.js
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

function initializeDatabase() {
  // Create the users table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user'
    );
  `);

  // Create the favorite_movies table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorite_movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('Database initialized successfully.');
}

// Initialize the database on every load for development and production
initializeDatabase();

export default db;
