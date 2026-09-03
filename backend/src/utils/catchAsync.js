// Express doesn't automatically catch rejected promises in async route
// handlers, so an unhandled rejection would crash the process instead
// of reaching the error middleware. Wrapping every controller in this
// once removes the need to repeat try/catch in each one.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
