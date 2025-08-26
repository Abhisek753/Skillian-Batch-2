
const express=require("express");
const router=express.Router();
const productController=require("../controllers/productController");
const authMiddleWare = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddelware");

router.post("/",
    authMiddleWare,
    upload.array("images", 5),//max 5 images
    productController.createProduct);
router.get("/",productController.getProducts);
router.get("/:id",productController.getProductById);
router.put("/:id",productController.updateProduct);
router.delete("/:id",productController.deleteProduct);

module.exports=router;
