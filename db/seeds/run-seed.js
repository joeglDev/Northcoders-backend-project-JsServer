
const seed = require("./seed.js");
const ENV = process.env.NODE_ENV || "development";
const data = require(`../data/${ENV}-data/index.js`);


const runSeed = () => {
  return seed(data).then(() => db.end());
}; 

module.exports = runSeed;
//module.exports = data;
