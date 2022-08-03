const db = require(`${__dirname}/../db/connection.js`);
const format = require("pg-format");

//checks that a value can be found in a table to distinguish retuned [] invalid id 404 from no results found but valid id
//returns true if found
module.exports = checkIdExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Error 404: No articles found for article_id ${value}.`,
      });
    } else {
      return true;
    }
  });
};
