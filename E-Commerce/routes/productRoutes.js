
const express=require("express");
const router=express.Router();
const productController=require("../controllers/productController");
const authMiddleWare = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddelware");

router.post("/",authMiddleWare,upload.array("images", 5),productController.createProduct);
router.get("/",productController.getAllProducts);
router.get("/:id",productController.getProductById);
router.put("/:id",productController.updateProduct);
router.delete("/:id",productController.deleteProduct);

module.exports=router;
