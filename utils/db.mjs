import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  // ตรงนี้ต้องเปลี่ยน connectionString เป็นของตัวเองด้วยนะ
  connectionString:
    "postgresql://postgres:Neyoti@4411@db.lnthauphbszppfvboagi.supabase.co:5432/postgres",
});

export default connectionPool;