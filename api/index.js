require("dotenv").config()

const app = require("../src/app.js")
const {connectDB} = require("../src/db/index.js")

module.exports = async (req, res) => {
    await connectDB()
    return app(req, res)
}