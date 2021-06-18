module.exports = {
  "server.js": require("./server.js"),
  ".env": require("./env.js"),
  "config": {
    "database.js": require("./config/database.js")
  },
  "controllers": {
    "user.js": require("./controllers/user.js")
  },
  "middleware": {
    "auth.js": require("./middleware/auth.js"),
    "errorHandler.js": require("./middleware/errorHandler.js")
  },
  "models": {
    "User.js": require("./models/User.js")
  },
  "routes": {
    "user.js": require("./routes/user.js")
  },
  "utils": {
    "jwt.js": require("./utils/jwt.js"),
    "mongooseErrorHandler.js": require("./utils/mongooseErrorHandler.js")
  },
  "modules": {
    "controller-factory.js": require(".//modules/controller-factory.js")
  },
}