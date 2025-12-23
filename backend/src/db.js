// backend/src/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("🟢 Conectado a PostgreSQL en Render");
});

pool.on("error", (err) => {
  console.error("🔴 Error de conexión a PostgreSQL:", err);
});

export default pool;
