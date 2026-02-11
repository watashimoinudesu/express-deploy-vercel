import "dotenv/config";
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000", 
      "https://sportory-blog.vercel.app", 
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


app.get("/posts/:postId", async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isFinite(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const result = await connectionPool.query(
      `
      SELECT
        p.id,
        p.image,
        COALESCE(c.name, 'General') AS category,
        p.title,
        p.description,
        TO_CHAR(p.date, 'DD FMMonth YYYY') AS date,
        p.likes_count AS likes,
        p.content
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
      `,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ ส่ง object ตรง ๆ ไม่ห่อ { data: ... }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("ERROR /posts/:postId:", error);
    return res.status(500).json({
      message: "Server could not read post because database connection",
      error: error.message,
    });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 50);
    const offset = (page - 1) * limit;

    const totalResult = await connectionPool.query("SELECT COUNT(*) FROM posts");
    const totalPosts = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsResult = await connectionPool.query(
      `
      SELECT
        p.id,
        p.image,
        COALESCE(c.name, 'General') AS category,
        p.title,
        p.description,
        -- ส่ง date เป็น string สวย ๆ เหมือน mock (จะได้ "11 September 2024")
        TO_CHAR(p.date, 'DD FMMonth YYYY') AS date,
        p.likes_count AS likes,
        p.content
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: postsResult.rows,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    console.error("ERROR /posts:", error);
    return res.status(500).json({
      message: "Server could not read posts",
      error: error.message,
    });
  }
});


app.post("/posts", async (req, res) => {
  try {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = req.body;

    // Basic validation
    if (!title || !image || !content) {
      return res.status(400).json({
        message: "Title, image and content are required",
      });
    }

    await connectionPool.query(
      `
      INSERT INTO posts
        (title, image, category_id, description, content, status_id)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      `,
      [title, image, category_id, description, content, status_id]
    );

    return res.status(201).json({
      message: "Created post sucessfully",
    });
  } catch (error) {
    console.error("ERROR POST /posts:", error);
    return res.status(500).json({
      message:
        "Server could not create post because database connection",
    });
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
