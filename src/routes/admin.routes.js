const Router = require("express")
const { login } = require("../controllers/admin.controller")

const router = Router()

router.route("/login",login)

module.exports = router