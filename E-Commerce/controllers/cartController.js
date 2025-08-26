const Cart=require("../models/Cart");
const Product=require("../models/Product");

//get get product from cart category userdetails

exports.getCartProducts = async (req, res) => {
   
};
exports.addOrUpdateCartItems = async (req, res) => {
   try{
     
    const {productId,quantity}=req.body;
    if(!productId || !quantity||quantity<1){
        return res.status(400).json({message:"Product id is not valid"})
    }
    const product=await Product.findById(productId);
    
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    let cart =await Cart.findOne({user:req.user.id});

    if(!cart){
        cart=new Cart({
            user:req.user.id,
            products:[{
                product:productId,
                quantity
            }]
        })
    }else{
        const itemIndex=cart.products.findIndex(p=>p.product.toString()===productId);
        //update quantity exist in the cart
        if(itemIndex>-1){
            cart.products[itemIndex].quantity=quantity;
        }else{
            cart.products.push({product:productId,quantity});
        }
        await cart.save();
    }
   }catch(err){
       console.error(err);
       res.status(500).json({ message: "Internal server error" });
   }
};
exports.removeCartItem = async (req, res) => {
   try{
       const { id } = req.params;
       const cart = await Cart.findOne({ user: req.user.id });
       if (!cart) {
           return res.status(404).json({ message: "Cart not found" });
       }
       cart.products = cart.products.filter(p => p.product.toString() !== id);
       await cart.save();
       res.status(200).json({ message: "Cart item removed successfully" });
   }catch(err){
       console.error(err);
       res.status(500).json({ message: "Internal server error" });
   }
};
exports.clearCart = async (req, res) => {
   try{
     const cart=await Cart.findOneAndDelete({user:req.user.id});
     if(!cart){
       return res.status(404).json({ message: "Cart not found" });
     }
     res.status(200).json({ message: "Cart cleared successfully" });
   }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
   }
};