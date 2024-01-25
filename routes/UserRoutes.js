const express = require("express");

const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getUser, updateUserRole, deleteUser } = require("../controller/UserController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/AuthUser");

const userRoute = express.Router();

userRoute.route("/register").post(registerUser);

userRoute.route("/login").post(loginUser);

userRoute.route("/password/forgot").post(forgotPassword);

userRoute.route("/password/reset/:token").put(resetPassword);

userRoute.route("/logout").post(logout);

userRoute.route("/me").get(isAuthenticatedUser, getUserDetails);

userRoute.route("/password/update").put(isAuthenticatedUser, updatePassword);

userRoute.route("/me/update").put(isAuthenticatedUser, updateProfile);

userRoute.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

userRoute.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUser);

userRoute.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

userRoute.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = userRoute
