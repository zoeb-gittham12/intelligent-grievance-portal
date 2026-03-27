import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import fs from "fs";

if (!fs.existsSync(".data")) {
    fs.mkdirSync(".data");
}

const client = new PGlite("./.data/postgres");
const db = drizzle(client);

async function main() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Student',
      department TEXT
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS complaints (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      predicted_department TEXT,
      predicted_priority TEXT,
      confidence_score INTEGER,
      status TEXT NOT NULL DEFAULT 'Pending',
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      assigned_to INTEGER
    );
  `);
  console.log("Tables created successfully");
  process.exit(0);
}
main().catch(console.error);
