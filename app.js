//Setup
const  express  = require('express');
const { Endpoints } = require('./globals');
const { getAllTopics } = require(`${__dirname}/controllers/controllers.js`);
const { handleInvalidPaths } = require(`${__dirname}/errors.js`);
//const port = 9090;

const app = express();
module.exports = app;

//Endpoints
app.get(Endpoints.ALL_TOPICS_END, getAllTopics);

//Error handling
app.use('*', handleInvalidPaths);

// //Listener
// app.listen(port, () => {
// console.log(`Server listening on port ${port}.`)
// });