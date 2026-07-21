
require("dotenv").config();
const {app} = require("./app.js")
const {sequelize} = require("./db/index.js")

 app.listen(process.env.PORT || 4000, () => {
            console.log(`Server running port on ${process.env.PORT}`)
    })

// const startServer = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("Database connect successfully")

//         await sequelize.sync();
//         console.log('All models synchronized');

//     } catch (error) {
//         console.log("DB Error :", error.message)
//         process.exit(1);
//     }
// }

// startServer()


// db.query("SELECT 1")
//     .then(() => {
//         console.log("Database connect successfully")

//         app.listen(process.env.PORT || 4000, () => {
//             console.log(`Server running port on ${process.env.PORT}`)
//         })
//     }).catch((err) => {
//         console.log("Database connection failed", err);
//         process.exit(1)
//     });
