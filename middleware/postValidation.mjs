// function isNonEmptyString(value) {
//     return typeof value === "string" && value.trim().length > 0;
//   }
  
//   function isNumber(value) {
//     return typeof value === "number" && Number.isFinite(value);
//   }
  
//   function fieldLabel(fieldName) {
//     // ใช้ทำ message ให้สวยขึ้น
//     // title -> Title, category_id -> Category_id
//     return fieldName
//       .split("_")
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//       .join("_");
//   }
  
//   export function validatePostPayload(req, res, next) {
//     const requiredFields = [
//       { key: "title", type: "string" },
//       { key: "image", type: "string" },
//       { key: "category_id", type: "number" },
//       { key: "description", type: "string" },
//       { key: "content", type: "string" },
//       { key: "status_id", type: "number" },
//     ];
  
//     for (const field of requiredFields) {
//       const value = req.body[field.key];
//       const label = fieldLabel(field.key);
  
//       // 1) required check
//       if (value === undefined || value === null) {
//         return res.status(400).json({ message: `${label} is required` });
//       }
  
//       // 2) type check + content check for string
//       if (field.type === "string") {
//         if (typeof value !== "string") {
//           return res.status(400).json({ message: `${label} must be a string` });
//         }
//         if (!isNonEmptyString(value)) {
//           // ถ้าอยากแยก message เป็น "cannot be empty" ก็ทำได้
//           return res.status(400).json({ message: `${label} is required` });
//         }
//       }
  
//       if (field.type === "number") {
//         if (typeof value !== "number") {
//           return res.status(400).json({ message: `${label} must be a number` });
//         }
//         if (!isNumber(value)) {
//           return res.status(400).json({ message: `${label} must be a number` });
//         }
//       }
//     }
  
//     next();
//   }
// middleware/validatePostData.js

function validatePostData(req, res, next) {
    const { title, image, category_id, description, content, status_id } =
      req.body;
  
    // Check for required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
  
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
  
    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
  
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
  
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
  
    if (!status_id) {
      return res.status(400).json({ message: "Status ID is required" });
    }
  
    // type validations
    if (typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
  
    if (typeof image !== "string") {
      return res.status(400).json({ message: "Image must be a string URL" });
    }
  
    if (typeof category_id !== "number") {
      return res.status(400).json({ message: "Category ID must be a number" });
    }
  
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description is must be a string" });
    }
  
    if (typeof content !== "string") {
      return res.status(400).json({ message: "Content is must be a string" });
    }
  
    if (typeof status_id !== "number") {
      return res.status(400).json({ message: "Status ID must be a number" });
    }
  
    next();
  }
  
  export default validatePostData;