import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health", (req, res) => {
  res.json({ message: "OK" });
});

export default app;
