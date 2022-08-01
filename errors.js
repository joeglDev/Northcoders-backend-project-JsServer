module.exports.handleInvalidPaths = (req, res, next) => {
    const responseBody = {status : 400, msg : "Error 400: Path invalid."};
    res.status(400).send(responseBody);
};