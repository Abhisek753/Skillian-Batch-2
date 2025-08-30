
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleWare = require("../middlewares/authMiddleware");

// Get user's cart
router.get("/", authMiddleWare, cartController.getCartProducts);

// Add items to cart
router.post("/", authMiddleWare, cartController.addToCart);

// Update cart item quantity
router.put("/:productId/quantity", authMiddleWare, cartController.updateCartItemQuantity);

// Remove item from cart
router.delete("/:id", authMiddleWare, cartController.removeCartItem);

// Clear entire cart
router.delete("/", authMiddleWare, cartController.clearCart);

module.exports = router;
