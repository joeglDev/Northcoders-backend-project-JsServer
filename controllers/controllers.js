const { selectAllTopics } = require(`${__dirname}/../models/models.js`);

module.exports.getAllTopics = (req, res) => {
  //invokes model
  selectAllTopics().then((topics) => {
    const responseBody = { topics };
    res.status(200).send(responseBody);
  });
};
