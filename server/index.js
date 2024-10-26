const express = require('express')
const cors = require('cors')
const router = require('./routes/routes')

require("dotenv").config();
const {connectToMongoDB} = require('./db/db')
const path = require('path')

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
})
app.use("/api/v1/", router)

async function startServer(){
    await connectToMongoDB();
    app.listen(port , () => {
        console.log(`server is listening on port ${port }`);
    }) 
}

startServer();
