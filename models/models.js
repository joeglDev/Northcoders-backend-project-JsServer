const db = require(`${__dirname}/../db/connection.js`);

module.exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows : topics}) => {
        return topics
    });
};

module.exports.selectArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({rows : article}) => {
        return article
    })
};