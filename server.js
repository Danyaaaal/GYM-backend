import express from "express";
import connectDB from "./config/connectDB.js";

const { PORT } = process.env;

// EXPRESS SERVER INSTANCE
const app = express();

// DB CONNECTION
await connectDB();

// URL ENCODED MIDDLEWARE
app.use(express.urlencoded({ extended: true }));

app.post("/",(req,res)=>{
   res.send("hello")
});

app.listen(PORT, (req, res) => {
  console.log(`server is running on http://localhost:${PORT}`);
});
