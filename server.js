import express from "express"
 const {PORT} = process.env
 const app = express()



 app.listen(PORT,(req,res) => {
    console.log(`server is running on http://localhost:${PORT}`)
 })