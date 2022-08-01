const { Endpoints } = require("../globals");
const  request  = require("supertest");
const app  = require(`${__dirname}/../app.js`);
const db = require(`${__dirname}/../db/connection.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`)
const seed = require(`${__dirname}/../db/seeds/seed.js`)

//before tests connect to database and run seed to populate

beforeEach(() => seed(data));


//tests for GET /api/topics
describe(Endpoints.ALL_TOPICS_END, () => {
  test("Get request responds with a http status code of 200", () => {
    return request(app).get(Endpoints.ALL_TOPICS_END).expect(200);
  });
  test("endpoint responds with an array of length 3", () => {
    return request(app).get(Endpoints.ALL_TOPICS_END)
    .then(({body : {topics}}) => {
        expect(topics.length).toBe(3);
    });
  });
});

afterAll(() => {return db.end()});