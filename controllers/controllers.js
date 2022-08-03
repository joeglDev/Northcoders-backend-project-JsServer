const {
  selectAllTopics,
  selectArticleById,
  selectAllUsers,
  updateArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
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
    .then(([article]) => {
      const responseBody = { article };
      res.status(200).send(responseBody);
    })
    .catch(next);
};

//select specific article

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
  selectAllUsers().then((users) => {
    const responseBody = { users };
    res.status(200).send(responseBody);
  });
};

module.exports.getAllArticles = (req, res) => {
  selectAllArticles().then((articles) => {
    const responseBody = { articles };
    res.status(200).send(responseBody);
  });
};

module.exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  selectCommentsByArticleId(id)
    .then((modelOutput) => {
      if (modelOutput === true) {
        //send empty array if valid ie article exists but no comments
        const responseBody = { comments: [] };
        res.status(200).send(responseBody);
      } else {
        const responseBody = { comments: modelOutput };
        res.status(200).send(responseBody);
      }
    })
    .catch(next);
};
