const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//error middleware

const errorMiddleWare = require("./middleware/Error")
//route product
const dotenv = require("dotenv").config({ path: "./config/Config.env" })
const product = require("./routes/ProductRoute");
const user = require("./routes/UserRoutes");
const order = require("./routes/OrderRoute");

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1", product)
app.use("/api/v1", user);
app.use("/api/v1", order)

// Error MiddleWare

app.use(errorMiddleWare)

module.exports = app