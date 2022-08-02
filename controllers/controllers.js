const {
  selectAllTopics,
  selectArticleById,
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
  //handle malformed req body

  //get article by id
  selectArticleById(id)
    .then((data) => {
      return data;
    })
    .then((data) => {
      const votesToAdd = req.body.inc_votes;
      //throw custom error for malformed req body
      if (!votesToAdd) {
        throw new Error("400-malformed-body");
      }
      if (typeof votesToAdd !== 'number') {
        throw new Error("400-bad-data-type")
      }
      const newVotes = data[0].votes + votesToAdd;
      return newVotes;
    })
    //update article
    .then((newVotes) => {
      updateArticleById(id, newVotes).then((article) => {
        const responseBody = { updated_article: article };
        res.status(201).send(responseBody);
      });
    })
    .catch(next);
};
