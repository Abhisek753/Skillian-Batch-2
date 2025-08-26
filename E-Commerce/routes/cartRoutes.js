
const express=require("express");
const router=express.Router();
const cartController=require("../controllers/cartController");
const authMiddleWare = require("../middlewares/authMiddleware");

router.get("/",authMiddleWare,cartController.getCartProducts);
router.post("/",authMiddleWare,cartController.addOrUpdateCartItems);
router.delete("/:id",authMiddleWare,cartController.removeCartItem);
router.delete("/",authMiddleWare,cartController.clearCart);

module.exports=router;
