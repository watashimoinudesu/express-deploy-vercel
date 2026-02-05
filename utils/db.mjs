// import * as pg from "pg";
// const { Pool } = pg.default;

// const connectionPool = new Pool({
//   // ตรงนี้ต้องเปลี่ยน connectionString เป็นของตัวเองด้วยนะ
//   connectionString:
//     "postgresql://postgres:Neyoti@4411@db.lnthauphbszppfvboagi.supabase.co:5432/postgres",
// });

// export default connectionPool;


import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

export default connectionPool;
