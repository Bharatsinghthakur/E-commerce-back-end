const express = require("express");
const ProductController = require("../controller/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/AuthUser");

const ProductRoute = express.Router();

// get all product --Admin
ProductRoute.get("/product", ProductController.getAllProduct)


// add product -- Admin

ProductRoute.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("admin"), ProductController.createProduct)

//Update product -- Admin


ProductRoute.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), ProductController.updateProduct);

// Get Single product -- Admin

ProductRoute.get("/product/singleproduct/:id", ProductController.getProductDetails);

// delete product -- Admin

ProductRoute.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), ProductController.deleteProduct)

// product review 

ProductRoute.put("/review", isAuthenticatedUser, ProductController.createProductReview);

// 

ProductRoute.get("/reviews", ProductController.getProductReviews);

//delete reviews
ProductRoute.delete("/reviews", isAuthenticatedUser, ProductController.deleteReview)

module.exports = ProductRoute
