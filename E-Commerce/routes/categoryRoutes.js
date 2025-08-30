const express=require("express");
const router=express.Router();
const categoryController=require("../controllers/categoryController");
const authMiddleWare = require("../middlewares/authMiddleware");

router.get("/",authMiddleWare,categoryController.getAllCategories);
router.post("/",authMiddleWare,categoryController.createCategory);
router.get("/:id",authMiddleWare,categoryController.getCategoryById);
router.put("/:id",authMiddleWare,categoryController.updateCategory);
router.delete("/:id",authMiddleWare,categoryController.deleteCategory);
module.exports=router;
