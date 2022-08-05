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
  topic = "1=1"
) => {
  //gets list of article topics and uses to determine if injected topic is valid
  return (
    helperGetTopics()
      .then((topics) => {
        return topics;
      })
      .then((topics) => {
        const topicArr = topics.map((obj) => {
          return obj.topic;
        });

        //topic = default -> pass
        //topic = invalid -> throw error
        //else topic is valid AND not default -> prepare sql statement
        if (topic === "1=1") {
        } else if (topicArr.includes(topic) === false) {
          throw new Error("403-bad-sql-query");
        } else {
          topic = `topic = '${topic}'`;
        }

        let sqlQuery = `SELECT articles.article_id,
articles.title,
articles.topic,
articles.author,
articles.created_at,
articles.votes,
CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles
LEFT OUTER JOIN comments
ON articles.article_id = comments.article_id
WHERE ${topic}
GROUP BY articles.article_id`;

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
        const validOrders = ["ASC", "DESC"];

        //if valid add to query statement
        if (validSorts.includes(sort_by)) {
          sqlQuery += ` ORDER BY articles.${sort_by}`;
          if (validOrders.includes(order)) {
            sqlQuery += ` ${order};`;
          }
        }

        //database query to get articles
        return db.query(sqlQuery).then(({ rows: articles }) => {
          return articles;
        });
      })
      //reject bad sql statements
      .catch((err) => {
        return Promise.reject(err);
      })
  );
};

//aids selection of valid topics from GET /api/articles?
const helperGetTopics = () => {
  return db.query("SELECT topic FROM articles;").then(({ rows: topics }) => {
    return topics;
  });
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
