const { selectAllTopics, selectArticleById } = require(`${__dirname}/../models/models.js`);

module.exports.getAllTopics = (req, res) => {
  //invokes model
  selectAllTopics().then((topics) => {
    const responseBody = { topics };
    res.status(200).send(responseBody);
  });
};

module.exports.getArticleById = (req, res) => {
  const id = req.params.article_id;
  selectArticleById(id).then((article) => {
    const responseBody = { article };
    res.status(200).send(responseBody);
  });
};
