module.exports = fn => {
  return (req, res, next) => {

    // 只要有error 透過next()傳 都直接進到error controller
    fn(req, res, next).catch( err => next(err))
    //一但觸法error 就會啟用 app.use(globalErrorHandler); ??
    //fn(req, res, next).catch( err => next(err));
  };
};
