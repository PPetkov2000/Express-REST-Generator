module.exports = `const User = require("../models/User")
const { generateToken } = require("../utils/jwt")

const getUsers = async (req, res, next) => {
  const usersPerPage = 8
  const page = Number(req.query.pageNumber) || 1
  try {
    const count = await User.countDocuments()
    const users = await User.find()
      .limit(usersPerPage)
      .skip(usersPerPage * (page - 1)) // 8 * (1 - 1) = 0 skipped users on page 1 | 8 * (2 - 1) = 8 skipped users on page 2
    res.json({ users, page, pages: Math.ceil(count / usersPerPage) })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error("User not Found")
    }
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (user) {
      user.email = req.body.email || user.email
      user.username = req.body.username || user.username
      user.isAdmin = req.body.isAdmin
      const updatedUser = await user.save()
      res.json(updatedUser)
    } else {
      res.status(404)
      throw new Error("User not Found")
    }
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      await user.remove()
      res.json({ message: "User removed" })
    } else {
      res.status(404)
      throw new Error("User not Found")
    }
  } catch (error) {
    next(error)
  }
}

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error("User not Found")
    }
  } catch (error) {
    next(error)
  }
}

const registerUser = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body

  try {
    const userExists = await User.findOne({ email })

    if (password !== confirmPassword) {
      res.status(400)
      throw new Error("Passwords do not match")
    }

    if (userExists) {
      res.status(400)
      throw new Error("Email is already taken")
    }

    const user = await User.create({ email, username, password })
    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

const authUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user && (await user.passwordsMatch(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error("Invalid email or password")
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  registerUser,
  authUser,
}
`