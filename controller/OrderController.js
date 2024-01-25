const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create New Order 

exports.newOrder = catchAsyncError(async (req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    })
})

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

   
    res.status(200).json({
        success: true,
        order
    })

})

// get Logged in user orders

exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })

    if (!orders) {
        return next(new ErrorHandler("order not found with this ID", 404));
    }

    res.status(200).json({
        success: true,
        orders
    })

})

// getAll orders --ADMIN 
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })


    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })

})

// update Order  ADMIN
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }


    if (order.status === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400))
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity)
    })

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })

})

// function for updating order Stock
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;


    await product.save({ validateBeforeSave: false })
}

//delete order Admin

exports.deleteOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true
    })

})