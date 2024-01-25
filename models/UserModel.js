const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name Should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email "]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "password Should be greater than 8 characters"],
        select: false, // this will give every details other than password
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();                                 // As we are seing when we update profile in document we will again send 
    }

    this.password = await bcrypt.hash(this.password, 10);

})

// User schema methods

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)

}


userSchema.methods.getResetPasswordToken = async function () {

    const resetToken =  crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}
// Generating password reset token
// userSchema.methods.getResetPasswordToken = async function(){
//     // GENERATING TOKEN 
//     console.log("hey")
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // hasing and adding reset passwordToken to UserSchema  // digest == hashvalue
//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//     // FOR PASSWORD EXPIRE RESET PASSWORD
//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

//     return resetToken;
// }


module.exports = mongoose.model("User", userSchema);