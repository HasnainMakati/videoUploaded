require("dotenv").config();

const app = require("./app.js");
const { connectDB } = require("./db/index.js");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB()
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer().catch((error) => {
    console.error("Unable to start server:", error.message)
    process.exit(1)
})