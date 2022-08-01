module.exports.handleInvalidPaths = (req, res) => {
    const responseBody = {status : 404, msg : "Error 404: Path invalid."};
    res.status(404).send(responseBody);
};