import express from "express";
import connectDB from "./config/connectDB.js";
import colors from "colors";
import router from "./routes/userRoute.js";
import errorHandler from "./middleware/errorHandler.js";
// import {
//   authenticateUser,
//   authorizeAdmin,
// } from "./middleware/authMiddleware.js";

const { PORT } = process.env;

// EXPRESS SERVER INSTANCE
const app = express();

// DB CONNECTION
await connectDB();

// URL ENCODED MIDDLEWARE
app.use(express.urlencoded({ extended: true }));

// Authentication and Authorization Middleware
// app.use(authenticateUser);
// app.use(authorizeAdmin);

app.use("/", router);

// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(
    `:::`.green,
    `Server is running on`.yellow,
    ` http://localhost:${PORT}`.green.underline.bold
  );
});
