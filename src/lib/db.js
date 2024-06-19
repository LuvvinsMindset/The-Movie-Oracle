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
      movie_title TEXT NOT NULL,
      poster_path TEXT NOT NULL,
      email TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Ensure the movie_title column exists in favorite_movies table
  const columns = db.prepare("PRAGMA table_info(favorite_movies);").all();
  const requiredColumns = ['movie_title', 'poster_path', 'email'];
  requiredColumns.forEach(column => {
    if (!columns.some(c => c.name === column)) {
      db.exec(`ALTER TABLE favorite_movies ADD COLUMN ${column} TEXT NOT NULL DEFAULT '';`);
    }
  });

  console.log('Database initialized successfully.');
}

// Initialize the database on every load for development and production
initializeDatabase();

export default db;
