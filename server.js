const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/Db")

// Handling uncaught exception 
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception error`);
  process.exit(1)
})

// console.log(youtube)

//config
dotenv.config({ path: "backend/config/Config.env" })

// after config we are calling database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection [ERROR HANDLING]

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  })

})