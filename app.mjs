
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000", 
      "https://sportory-blog.vercel.app/", 
    ],
  })
);

// app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/env-check", (req, res) => {
  res.json({ hasDB: !!process.env.CONNECTION_STRING });
});


app.get("/p", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT * FROM posts");
    return  res.json(result.rows);
  }catch (error) {
    console.error("Error getting assignments:", error);
    return res.status(500).json({ message: "Server could not read table because database connection" })
  }
});


app.get("/health", (req, res) => {
  res.json({ message: "OK" });
});




// Start server locally (not on Vercel)
const isVercel = process.env.VERCEL;
if (!isVercel) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test /health endpoint at http://localhost:${PORT}/health`);
  });
}

// Export for Vercel - Express app can be exported directly
export default app;
