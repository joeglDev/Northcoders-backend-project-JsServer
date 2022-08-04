//Setup
const  express  = require('express');
const { Endpoints } = require('./globals');
const { getAllTopics, getArticleById, patchArticleById, getAllUsers, getAllArticles, getCommentsByArticleId, postCommentsByArticleId} = require(`${__dirname}/controllers/controllers.js`);
const { handleInvalidPaths, handleCustomErrors, handlePsqlErrors} = require(`${__dirname}/errors.js`);
//const port = 9090;

const app = express();
module.exports = app;
app.use(express.json());

//Endpoints
app.get(Endpoints.ALL_TOPICS_END, getAllTopics);
app.get(Endpoints.ARTICLE_BY_ID_END, getArticleById);
app.patch(Endpoints.ARTICLE_BY_ID_END, patchArticleById);
app.get(Endpoints.ALL_USERS_END, getAllUsers);
app.get(Endpoints.ALL_ARTICLES_END, getAllArticles);
app.get(Endpoints.ALL_COMMENTS_BY_ARTICLE_ID, getCommentsByArticleId);
app.post(Endpoints.ALL_COMMENTS_BY_ARTICLE_ID, postCommentsByArticleId);

//Error handling
app.get('*', handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);

// //Listener
// app.listen(port, () => {
// console.log(`Server listening on port ${port}.`)
// });