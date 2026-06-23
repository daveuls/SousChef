import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sql from "mssql";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    enableArithAbort: true,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed.", err);
    process.exit(1);
  });

app.get("/recipes", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Recipes");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to load recipes" });
  }
});

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
});
