const {
  selectAllTopics,
  selectArticleById,
  selectAllUsers,
  updateArticleById,
} = require(`${__dirname}/../models/models.js`);

module.exports.getAllTopics = (req, res) => {
  //invokes model
  selectAllTopics().then((topics) => {
    const responseBody = { topics };
    res.status(200).send(responseBody);
  });
};

module.exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      const responseBody = { article };
      res.status(200).send(responseBody);
    })
    .catch(next);
};

module.exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;
  //handle malformed req body
  if (!votes) {
    throw new Error("400-malformed-body");
  }
  if (typeof votes !== "number") {
    throw new Error("400-bad-data-type");
  }
  //update article
  updateArticleById(id, votes)
    .then((article) => {
      const responseBody = { updated_article: article };
      res.status(201).send(responseBody);
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res) => {
  selectAllUsers()
  .then((users) => {
    const responseBody = {users}
  res.status(200).send(users);
  });
  };


