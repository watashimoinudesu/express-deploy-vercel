// middleware/validatePostPayload.js
function fieldLabel(fieldName) {
    return fieldName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("_");
  }
  
  function requireField(body, key) {
    const val = body[key];
    if (val === undefined || val === null) {
      return { ok: false, message: `${fieldLabel(key)} is required` };
    }
    return { ok: true, value: val };
  }
  
  function requireString(body, key) {
    const r = requireField(body, key);
    if (!r.ok) return r;
    if (typeof r.value !== "string") {
      return { ok: false, message: `${fieldLabel(key)} must be a string` };
    }
    if (r.value.trim().length === 0) {
      return { ok: false, message: `${fieldLabel(key)} is required` };
    }
    return { ok: true, value: r.value };
  }
  
  function requireNumber(body, key) {
    const r = requireField(body, key);
    if (!r.ok) return r;
  
    // อนุญาตให้ client ส่งมาเป็น "2" แล้วแปลงให้
    const val = typeof r.value === "string" ? Number(r.value) : r.value;
  
    if (typeof val !== "number" || !Number.isFinite(val)) {
      return { ok: false, message: `${fieldLabel(key)} must be a number` };
    }
  
    return { ok: true, value: val };
  }
  
  export function validatePostPayload(req, res, next) {
    const checks = [
      requireString(req.body, "title"),
      requireString(req.body, "image"),
      requireNumber(req.body, "category_id"),
      requireString(req.body, "description"),
      requireString(req.body, "content"),
      requireNumber(req.body, "status_id"),
    ];
  
    const bad = checks.find((c) => !c.ok);
    if (bad) return res.status(400).json({ message: bad.message });
  
    // เซ็ตค่าให้เป็นชนิดที่ถูกต้อง (สำคัญมากสำหรับ category_id/status_id)
    req.body.category_id = checks[2].value;
    req.body.status_id = checks[5].value;
  
    next();
  }
  

// function validatePostData(req, res, next) {
//     const { title, image, category_id, description, content, status_id } =
//       req.body;
  
//     // Check for required fields
//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }
  
//     if (!image) {
//       return res.status(400).json({ message: "Image is required" });
//     }
  
//     if (!category_id) {
//       return res.status(400).json({ message: "Category ID is required" });
//     }
  
//     if (!description) {
//       return res.status(400).json({ message: "Description is required" });
//     }
  
//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }
  
//     if (!status_id) {
//       return res.status(400).json({ message: "Status ID is required" });
//     }
  
//     // type validations
//     if (typeof title !== "string") {
//       return res.status(400).json({ message: "Title must be a string" });
//     }
  
//     if (typeof image !== "string") {
//       return res.status(400).json({ message: "Image must be a string URL" });
//     }
  
//     if (typeof category_id !== "number") {
//       return res.status(400).json({ message: "Category ID must be a number" });
//     }
  
//     if (typeof description !== "string") {
//       return res.status(400).json({ message: "Description is must be a string" });
//     }
  
//     if (typeof content !== "string") {
//       return res.status(400).json({ message: "Content is must be a string" });
//     }
  
//     if (typeof status_id !== "number") {
//       return res.status(400).json({ message: "Status ID must be a number" });
//     }
  
//     next();
//   }
  
//   export default validatePostData;