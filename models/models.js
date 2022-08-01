const db = require(`${__dirname}/../db/connection.js`);

module.exports.selectAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows : topics}) => {
        return topics
    })
};