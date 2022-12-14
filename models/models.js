const db = require(`${__dirname}/../db/connection.js`);
const checkIdExists = require(`${__dirname}/../utils`);

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

//guards against sql injection attacks
//checks queries against allowed values and if valid inserts into sql statement
// topic defaults -> 1=1 -> true therefore where true if not specified
module.exports.selectAllArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  //LOGIC BIFURCATES
  //1. topic = undefined -> run sqlquery
  //2. topic -> insert into prepared
  let sqlQuery;
  if (topic) {
    sqlQuery = `SELECT articles.article_id,
          articles.title,
          articles.topic,
          articles.author,
          articles.created_at,
          articles.votes,
          CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles
          LEFT OUTER JOIN comments
          ON articles.article_id = comments.article_id
          WHERE topic = $1
          GROUP BY articles.article_id`;
  } else {
    sqlQuery = `SELECT articles.article_id,
          articles.title,
          articles.topic,
          articles.author,
          articles.created_at,
          articles.votes,
          CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles
          LEFT OUTER JOIN comments
          ON articles.article_id = comments.article_id
          GROUP BY articles.article_id`;
  }

  //check urlqueries  sort_by, order are valid
  const validSorts = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC", "asc", "desc"];

  //else throw new error
  //if valid add to query statement
  if (validSorts.includes(sort_by)) {
    sqlQuery += ` ORDER BY articles.${sort_by}`;
    if (validOrders.includes(order)) {
      sqlQuery += ` ${order};`;
    } else {
      return Promise.reject("400-invalid-query");
    }
  } else {
    return Promise.reject("400-invalid-query");
  }

  //database query to get articles
  if (!topic) {
    return db.query(sqlQuery).then(({ rows: articles }) => {
      return articles;
    });
  } else {
    return db.query(sqlQuery, [topic]).then(({ rows: articles }) => {
      //if no articles found check if topic is present
      if (articles.length === 0) {
        return checkIdExists("articles", "topic", topic).catch((err) => {
          return Promise.reject(err);
        });
      }
      return articles;
    });
  }
};

module.exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, 
      author, 
      body, 
      created_at, 
      votes 
      FROM comments WHERE article_id = $1`,
      [id]
    )
    .then(({ rows: comments }) => {
      if (!comments.length) {
        const isFound = checkIdExists("articles", "article_id", id);
        return isFound;
      } else {
        return comments;
      }
    });
};

//requires helper function to insert new username FK into user table
module.exports.insertCommentByArticleId = (id, username, body) => {
  const currentDate = new Date();
  const newComment = {
    author: username,
    body: body,
    created_at: currentDate,
    votes: 0,
    article_id: id,
  };

  return insertUser(username)
    .then(() => {
      return db.query(
        ` 
  INSERT INTO comments
 (author, body, created_at, votes, article_id)
VALUES
($1, $2, $3, $4, $5) RETURNING *;`,
        [
          newComment.author,
          newComment.body,
          newComment.created_at,
          newComment.votes,
          newComment.article_id,
        ]
      );
    })

    .then(({ rows: comment }) => {
      return comment;
    });
};

const insertUser = (username) => {
  return (
    db
      .query(
        ` 
  INSERT INTO users (username, name) VALUES ($1, $2);`,
        [username, "PLACEHOLDER"]
      )
      //catch PSQL errors resulting from duplicate username PRIMARY KEY
      .catch((err) => {
        if (err.code === "23505") {
          return Promise.resolve();
        }
      })
  );
};

module.exports.deleteComment = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then(({ rows: comment }) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error 404: No comment found for comment_id ${id}.`,
        });
      }
    });
};

module.exports.readApi = () => {
  const fs = require("fs/promises");
  return fs.readFile(`${__dirname}/../endpoints.json`, 'utf8')
  .then((endpoints) => {
    return endpoints
  })
  .catch((err) => {
    console.log(err)
  })

  
};
