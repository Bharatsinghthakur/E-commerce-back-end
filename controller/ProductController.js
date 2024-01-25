const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/ProductModel");
const ApiFeatures = require("../utils/ApiFeatures");
const ErrorHandler = require("../utils/ErrorHandler");

//Admin create Product

exports.createProduct = catchAsyncError(async (req, res, next) => {
  // for creating ID for create product   -- now which user created which object will be identified
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// GET ALL PRODUCT -- Admin

exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;

  const productCount = await Product.countDocuments(); // for counting the documents that has been send to the front-end User

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const product = await apiFeatures.query; // same class has been return from contructor

  res.status(201).json({
    success: true,
    product,
    productCount,
  });
});

// upate product --Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found"));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    sucess: true,
    product,
  });
});

// get single product details --Admin

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found"), 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// delete product --Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "poduct Not Found",
    });
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "product deleted Successfully",
  });
});

// Create A review or update Review

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  console.log(rating, comment, productId);
  console.log(req.body);
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All reviews of a product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return new ErrorHandler("product not found", 404);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete Review of the Product

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  console.log(product);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
    message: "review deleted succesfully",
  });
});
