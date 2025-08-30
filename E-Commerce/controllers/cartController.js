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

// Add or update items in cart
exports.addOrUpdateCartItems = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID and valid quantity are required' 
            });
        }

        // Check if product exists and is in stock
        const product = await Product.findOne({ 
            _id: productId,
            isActive: true,
            stock: { $gte: quantity }
        });

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found or out of stock' 
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
            // Update quantity if product exists in cart
            const newQuantity = cart.products[itemIndex].quantity + quantity;
            
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items available in stock`
                });
            }
            
            cart.products[itemIndex].quantity = newQuantity;
        } else {
            // Add new product to cart
            cart.products.push({
                product: productId,
                quantity
            });
        }

        await cart.save();
        const updatedCart = await getCartWithProducts(req.user.id);
        
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart: updatedCart
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating cart' 
        });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const initialCount = cart.products.length;
        cart.products = cart.products.filter(
            p => p.product.toString() !== id
        );

        if (initialCount === cart.products.length) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        await cart.save();
        const updatedCart = await getCartWithProducts(req.user.id);
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: updatedCart
        });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing item from cart'
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
        const { quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and valid quantity are required'
            });
        }

        // Check product stock
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        // Update cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.products.findIndex(
            p => p.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // Update quantity
        cart.products[itemIndex].quantity = quantity;
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