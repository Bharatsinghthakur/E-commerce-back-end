const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/OrderController");
const orderRoute = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/AuthUser")

orderRoute.route("/order/new").post(isAuthenticatedUser, newOrder);
//Information of order
orderRoute.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

orderRoute.route("/orders/me").get(isAuthenticatedUser, myOrders)
// ADMIN ORDERS
orderRoute.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

orderRoute.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

orderRoute.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)




module.exports = orderRoute
