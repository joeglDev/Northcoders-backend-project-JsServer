const { Endpoints } = require("../globals");
const request = require("supertest");
const app = require(`${__dirname}/../app.js`);
const db = require(`${__dirname}/../db/connection.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);

//before tests connect to database and run seed to populate
beforeEach(() => seed(data));

//tests for GET /api/topics
describe(Endpoints.ALL_TOPICS_END, () => {
  test("Get request responds with a http status code of 200", () => {
    return request(app).get(Endpoints.ALL_TOPICS_END).expect(200);
  });
  test("endpoint responds with an array of length 3", () => {
    return request(app)
      .get(Endpoints.ALL_TOPICS_END)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
      });
  });
  test("invalid path returns a http status code of 404", () => {
    return request(app).get(Endpoints.INVALID_END).expect(400);
  });
  test("returns a error message object for an invalid endpoint", () => {
    return request(app)
      .get(Endpoints.INVALID_END)
      .then(({ body: response }) => {
        expect(response.msg).toBe("Error 400: Path invalid.");
      });
  });
});

//tests for GET /api/articles/:article_id
describe(Endpoints.ARTICLE_BY_ID_END, () => {
  test("GET request returns a status code of 200", () => {
    return request(app).get("/api/articles/3").expect(200);
  });
  test("GET request returns an article object on key of article", () => {
    return request(app)
      .get("/api/articles/3")
      .then(({ body: { article } }) => {
        article = article[0];
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("Get request with out of range ID returns an http 404", () => {
    return request(app).get("/api/articles/6767").expect(404);
  });
  test("Get request with out of range ID returns an error object", () => {
    return request(app)
      .get("/api/articles/6767")
      .then(({ body: err }) => {
        expect(err.msg).toBe(
          "Error 404: No articles found for article_id 6767."
        );
      });
  });
  test("Get request with invalid id returns http status 400", () => {
    return request(app).get("/api/articles/notNumber").expect(400);
  });
  test("Get request invalid id returns an error object", () => {
    return request(app)
      .get("/api/articles/notNumber")
      .then(({ body: err }) => {
        expect(err.msg).toBe("Error 400: Not a valid id.");
      });
  });
});

//close connection to database
afterAll(() => {
  return db.end();
});
