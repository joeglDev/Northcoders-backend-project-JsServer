//Setup
const  express  = require('express');
const { Endpoints } = require('./globals');
const { getAllTopics, getArticleById} = require(`${__dirname}/controllers/controllers.js`);
const { handleInvalidPaths, handleCustomErrors } = require(`${__dirname}/errors.js`);
//const port = 9090;

const app = express();
module.exports = app;

//Endpoints
app.get(Endpoints.ALL_TOPICS_END, getAllTopics);
app.get(Endpoints.ARTICLE_BY_ID_END, getArticleById);

//Error handling
app.get('*', handleInvalidPaths);
app.use(handleCustomErrors);

// //Listener
// app.listen(port, () => {
// console.log(`Server listening on port ${port}.`)
// });