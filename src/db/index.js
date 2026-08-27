require("dotenv").config();
const mongoose = require("mongoose")

let connectionPromise

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) throw new Error("MONGODB_URI is not configured")

    if (mongoose.connection.readyState === 1) return
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(mongoUri)
            .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
            .catch((error) => {
                connectionPromise = undefined
                throw error
            })
    }
    await connectionPromise
}

module.exports = {connectDB}
