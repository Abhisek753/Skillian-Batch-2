const express=require("express");
const getAllProducts = require("../controllers/productController");

const router=express.Router();

router.get("/getall",getAllProducts);

module.exports=router;