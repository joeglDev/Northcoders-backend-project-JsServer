const db = require(`${__dirname}/../db/connection.js`);

module.exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

module.exports.selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error 404: No articles found for article_id ${id}.`,
        });
      }
      return article;
    });
};


module.exports.updateArticleById = (id, votesToAdd) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votesToAdd, id]
    )
    .then((data) => {
      const article = data.rows[0];
      return article;
    });
};

module.exports.selectAllUsers = () => {
  return db
  .query('SELECT * FROM users')
  .then(({rows : users}) => {
  return users
  })
  };
  
