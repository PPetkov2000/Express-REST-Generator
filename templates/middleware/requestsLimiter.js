module.exports = `const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many accounts created from this IP, please try again after an hour"
});

const setup = (app) => {
  app.set('trust proxy', 1);
  app.use(limiter);
}

module.exports.setup = setup;
module.exports.createAccountLimiter = createAccountLimiter;
`