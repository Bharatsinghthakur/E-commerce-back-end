const mongoose = require("mongoose");
const connectDatabase = function () {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
        (data) => {
            console.log(`MongoDB Connected With Server:${data.connection.host}`)
        })
    // .catch((err) => {
    //     console.log(err)
    // })                            // when we put unhandled promise error we dont need catch block for this error
}

module.exports = connectDatabase