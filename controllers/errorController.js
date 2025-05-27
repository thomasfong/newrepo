exports.triggerError = (req, res, next) => {
  next(new Error("Intentional footer-based error triggered!"));
};
