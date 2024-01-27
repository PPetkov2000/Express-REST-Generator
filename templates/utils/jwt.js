module.exports = `const jwt = require("jsonwebtoken")

const generateToken = (data, options = { expiresIn: '7d' }) => {
  return jwt.sign(data, process.env.JWT_SECRET, options)
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }
`
