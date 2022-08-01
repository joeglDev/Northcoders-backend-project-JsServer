module.exports.handleInvalidPaths = (req, res, next) => {
  const responseBody = { status: 400, msg: "Error 400: Path invalid." };
  res.status(400).send(responseBody);
};

module.exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(404).send(err);
  } else {
    next(err);
  }
};
