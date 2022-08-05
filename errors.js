module.exports.handleInvalidPaths = (req, res, next) => {
  const responseBody = { status: 400, msg: "Error 400: Path invalid." };
  res.status(400).send(responseBody);
};

module.exports.handleCustomErrors = (err, req, res, next) => {
  //404 content not found
  if (err.status === 404 && err.msg) {
    res.status(404).send(err);
  } 
  //400 Bad Request - malformed body
  else if (err.message === '400-malformed-body' ) {
const responseBody = {status: 400, msg : "Error 400: Malformed request body."}
    res.status(400).send(responseBody)
  }
  //400 Bad Request - invalid data type
  else if(err.message === "400-bad-data-type") {
    const responseBody = {status: 400, msg :  "Error 400: Body has invalid data type."}
    res.status(400).send(responseBody)
  }
  //403 Forbidden - bad sql query
  else if(err.message === "400-bad-sql-query") {
    const responseBody = { status: 400, msg: "Error 400: Inavalid query value" };
    res.status(400).send(responseBody)
  }
  else {
    next(err);
  }
};

module.exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    const responseBody = { status: 400, msg: "Error 400: Not a valid id." };
    res.status(400).send(responseBody);
  } else {
    next(err);
  }
};
