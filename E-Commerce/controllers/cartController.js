const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user's cart with product details and category
const getCartWithProducts = async (userId) => {
    return await Cart.findOne({ user: userId })
        .populate({
            path: 'products.product',
            select: 'name price image stock category',
            populate: {
                path: 'category',
                select: 'name'
            }
        });
};

// Get cart products with details
exports.getCartProducts = async (req, res) => {
    try {
        const cart = await getCartWithProducts(req.user.id);
        
        if (!cart || cart.products.length === 0) {
            return res.status(200).json({ 
                message: 'Your cart is empty',
                items: [],
                total: 0,
                totalItems: 0
            });
        }

        // Calculate totals
        const items = cart.products.map(item => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity
        }));

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        res.status(200).json({
            items,
            total,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error while fetching cart' });
    }
};

// Add items to cart (only adds, doesn't update)
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity  } = req.body;

        // Validate input
        if (!productId || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Valid product ID and quantity are required' 
            });
        }

        // Check if product exists and is active
        const product = await Product.findOne({ 
            _id: productId,
           
        });

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found or inactive' 
            });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                products: []
            });
        }

        // Check if product already in cart
        const itemIndex = cart.products.findIndex(
            p => p.product.toString() === productId
        );

        if (itemIndex > -1) {
            // If item exists, don't add again (use update endpoint instead)
            return res.status(400).json({
                success: false,
                message: 'Item already in cart. Use update endpoint to change quantity.'
            });
        }

        // Add new product to cart
        cart.products.push({
            product: productId,
            quantity
        });

        await cart.save();
        const updatedCart = await getCartWithProducts(req.user.id);
        
        res.status(201).json({
            success: true,
            message: 'Item added to cart successfully',
            cart: updatedCart
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while adding to cart' 
        });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { id: productId } = req.params;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        // Find the cart
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Check if product exists in cart
        const itemIndex = cart.products.findIndex(
            p => p.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // Remove the item
        const [removedItem] = cart.products.splice(itemIndex, 1);
        
        // If cart is empty after removal, delete it
        if (cart.products.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            return res.status(200).json({
                success: true,
                message: 'Item removed. Cart is now empty.',
                cart: { products: [], total: 0, totalItems: 0 }
            });
        }

        await cart.save();
        const updatedCart = await getCartWithProducts(req.user.id);
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: updatedCart,
            removedItem: {
                productId: removedItem.product,
                quantity: removedItem.quantity
            }
        });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing item from cart',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const result = await Cart.findOneAndDelete({ user: req.user.id });
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found or already empty'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: { products: [], total: 0, totalItems: 0 }
        });
        
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while clearing cart'
        });
    }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { action = 'set', quantity } = req.body;

        // Validate input
        if (!productId || (action === 'set' && (!quantity || quantity < 1))) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and valid quantity are required'
            });
        }

        // Find the product
        const product = await Product.findOne({ 
            _id: productId,
            isActive: true 
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive'
            });
        }

        // Find the cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find the item in cart
        const itemIndex = cart.products.findIndex(
            p => p.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // Calculate new quantity based on action
        let newQuantity;
        switch (action) {
            case 'increment':
                newQuantity = cart.products[itemIndex].quantity + (quantity || 1);
                break;
            case 'decrement':
                newQuantity = Math.max(1, cart.products[itemIndex].quantity - (quantity || 1));
                break;
            case 'set':
            default:
                newQuantity = quantity;
        }

        // Check stock availability
        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`,
                maxAllowed: product.stock
            });
        }

        // Update quantity
        cart.products[itemIndex].quantity = newQuantity;
        
        // Remove item if quantity is zero
        if (newQuantity < 1) {
            cart.products.splice(itemIndex, 1);
        }

        await cart.save();
        const updatedCart = await getCartWithProducts(req.user.id);
        
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart: updatedCart
        });

    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating cart item quantity'
        });
    }
};