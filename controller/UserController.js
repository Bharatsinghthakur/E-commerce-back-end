const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")

// Register a user 

exports.registerUser = catchAsyncError(

    async (req, res, next) => {
        const { name, email, password } = req.body;

        const user = await User.create({
            name, email, password,
            avatar: {
                public_id: "this is a sample Id",
                url: "profilePicUrl"
            },
        });

        // for token in response
        // we have created whole jwt token function and using it 
        sendToken(user, 201, res)

    }
);


exports.loginUser = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;

        //checking if user has given password and email both 

        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email & password", 400))
        }

        const user = await User.findOne({ email }).select("+password");
        // jab email(key-value) same hai too hum ek lekh skte hai 
        // or humme emai or password donoo lene hai to select method use kr rhe h 

        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password", 401));

            // we are sending both INVALID email or password becasue of security reasons
        }

        const isPasswordMatched = user.comparePassword(password);


        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Email or password", 401));
        }

        // we have created whole jwt token function and using it 
        sendToken(user, 200, res);

    }

);

exports.logout = catchAsyncError(

    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({
            sucess: true,
            message: "logOut succesfull"

        })
    }
)

exports.forgotPassword = catchAsyncError(
    async (req, res, next) => {

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler("user Not found", 404))
        }

        // GET RESETPASSWORD TOKEN 

        const resetToken = user.getResetPasswordToken();

        const restTokenValid = await resetToken.then(success => success) // bc resetToken was giving promise in return
        await user.save({ validateBeforeSave: false }); // imp to save schema deatils


        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${restTokenValid}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it `;

        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce Password Recovery`,
                message

            })
            res.status(200).json({
                sucess: true,
                message: `Email send to ${user.email} successfully`

            })

        } catch (err) {
            // because we have already saved it in the database

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(err.message, 500))

        }
    }

)

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash token because we saved token in hashed token only
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken, // because same key-value so we took only one value {a:a}  = a 
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined; // we are undefined these values because we dont need them 
    user.resetPasswordExpire = undefined; // unless he request again for password change

    await user.save();

    // again calling JWT TOken so that user can redirect to login
    sendToken(user, 200, res);

})


// Get User Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        succes: true,
        user
    })
})

// Update user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password") // beacuse password is hidden

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesnot match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
})

exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true
    })
})

// Get all users(admin)

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        succes: true,
        users
    })
})

// get user -- admin

exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.find({ _id: req.params.id });

    if (!user) {
        return next(new ErrorHandler(`User Doesnot exists with this id:${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update User Role -- Admin

exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    if (!user) {
        return next(new ErrorHandler(`User doesnot exist with Id:${req.params.id}`, 400));
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true
    })
})

// Delete User  -- Admin

exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    // we will add cloudinary later

    if (!user) {
        return next(new ErrorHandler(`User doesnot exist with Id:${req.params.id}`, 400));
    }

    await user.remove()
    res.status(200).json({
        success: true,
        message: "User deleted Succesfully"
    })
})
