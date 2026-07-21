
require("dotenv").config();
const { app } = require("./app.js")
const { sequelize } = require("./db/index.js")

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running port on ${process.env.PORT}`)
})

