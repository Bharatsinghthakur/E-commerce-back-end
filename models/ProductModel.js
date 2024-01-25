const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please Enter Product Name"] },
    description: { type: String, required: [true, "please Enter Product Description"] },
    price: {
        type: Number, required: [true, "Please Enter Product Description"],
        maxLength: [8, "Please Cannot exceed 8 Characters"]
    },
    ratings: { type: Number, default: 0 },
    image: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please Enter category"]

    },
    stock: {
        type: Number,
        required: [true, "please Enter Stock"],
        maxLength: [4, "stock Cannot exceeds 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("product", productSchema);