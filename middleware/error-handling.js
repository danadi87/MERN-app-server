function notFoundHandler(req, res, next) {
  console.log("Page not found", req.method, req.path);
  res.status(404).json({ message: "This route does not exist" });
}
function errorHandler(err, req, res, next) {
  console.error("Error", req.method, req.path, err);
  if (!res.headersSent) {
    res
      .status(500)
      .json({ message: "Internal server error. Check the server console" });
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
