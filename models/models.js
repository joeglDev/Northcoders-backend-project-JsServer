const db = require(`${__dirname}/../db/connection.js`);

module.exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

module.exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,
    CAST(COUNT(articles.article_id) AS INT) AS comment_count FROM articles
    INNER JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
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
  return db.query("SELECT * FROM users").then(({ rows: users }) => {
    return users;
  });
};

module.exports.selectAllArticles = () => {
  return db.query(`SELECT articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  CAST(COUNT(articles.article_id) AS INT) AS comment_count FROM articles
  INNER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`)
  .then(({rows : articles}) => {
    return articles
  })
}