module.exports = `const router = require("express").Router()
const { getUsers, getUserById, updateUser, deleteUser, getUserProfile, registerUser, authUser } = require("../controllers/user")
const { isAuth, isAdmin } = require("../middleware/auth")
const { createAccountLimiter } = require('../middleware/rateLimiter')

router.route("/").get(isAuth, isAdmin, getUsers)
router.route("/profile").get(isAuth, getUserProfile)
router
  .route("/:id")
  .get(isAuth, isAdmin, getUserById)
  .put(isAuth, isAdmin, updateUser)
  .delete(isAuth, isAdmin, deleteUser)
router.route("/register").post(createAccountLimiter, registerUser)
router.route("/login").post(authUser)

module.exports = router
`
