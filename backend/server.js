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
const recipesRouter = express.Router();

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

recipesRouter.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Recipes");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to load recipes" });
  }
});

recipesRouter.get("/ingredients/:recipeId", async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RecipeId", sql.Int, recipeId)
      .execute("dbo.GetIngredientsByRecipeId");

    res.json(result.recordset || []);
  } catch (err) {
    console.error(
      "Error fetching ingredients. Looks like you're starving tonight:",
      err,
    );
    res.status(500).json({ error: "Failed to load ingredients" });
  }
});

recipesRouter.get("/instructions/:recipeId", async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RecipeId", sql.Int, recipeId)
      .execute("dbo.GetInstructionsByRecipeId");

    res.json(result.recordset || []);
  } catch (err) {
    console.error(
      "Uh Oh. Error loading the instructions. You can always make slop:",
      err,
    );
    res.status(500).json({ error: "Failed to load instructions" });
  }
});

// the below API call is a POC for adding video and the full recipe call will be added at a later date.
recipesRouter.post("/", async (req, res) => {
  try {
    const { recipeName, recipeType, videoUrl } = req.body;

    if (!recipeName || !recipeType) {
      return res.status(400).json({ error: "recipeName and recipeType are required" });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RecipeName", sql.VarChar(255), recipeName)
      .input("RecipeType", sql.VarChar(255), recipeType)
      .input("RecipeUrl", sql.VarChar(1000), videoUrl)
      .execute("dbo.CreateNewRecipeVIDEOONLY");

      const recipeId = result.recordset[0]?.RecipeId;

      res.status(201).json({ id: recipeId, recipeName, recipeType, videoUrl });
  } catch (err) {
    console.error("Error creating new recipe:", err);
    res.status(500).json({ error: "Failed to create new recipe" });
  }
});

app.use("/recipes", recipesRouter);

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
});
