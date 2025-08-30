
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleWare = require("../middlewares/authMiddleware");

// Get user's cart
router.get("/", authMiddleWare, cartController.getCartProducts);

// Add or update items in cart
router.post("/", authMiddleWare, cartController.addOrUpdateCartItems);

// Update cart item quantity
router.put("/:productId/quantity", authMiddleWare, cartController.updateCartItemQuantity);

// Remove item from cart
router.delete("/:id", authMiddleWare, cartController.removeCartItem);

// Clear entire cart
router.delete("/", authMiddleWare, cartController.clearCart);

module.exports = router;
