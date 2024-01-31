module.exports = `const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const helmet = require("helmet");
const connectDB = require("./config/database")
const { notFound, errorHandler } = require("./middleware/errorHandler")
const userRoutes = require("./routes/user")
const requestsLimiter = require("./middleware/requestsLimiter");

dotenv.config()
connectDB()

const app = express()

app.use(helmet());
process.env.NODE_ENV !== 'prod' && app.use(logger("dev"))
app.use(cors({ origin: '127.0.0.1', credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.use(cookieParser())

requestsLimiter.setup(app)

app.use("/api/v1/users", userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log("Server is running on port: " + PORT))
`
