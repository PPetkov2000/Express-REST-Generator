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

requestsLimiter.setup(app)

app.use(helmet());
app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1/users", userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log("Server is running on port: " + PORT))
`
