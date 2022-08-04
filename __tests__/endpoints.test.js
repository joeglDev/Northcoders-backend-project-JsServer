const { Endpoints } = require("../globals");
const request = require("supertest");
const app = require(`${__dirname}/../app.js`);
const db = require(`${__dirname}/../db/connection.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
require("jest-sorted");

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
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("GET returns correct value of comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
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

//tests for Patch /api/articles/:article_id
describe(Endpoints.ARTICLE_BY_ID_END, () => {
  test("returns a status code of 201 and a updated article obj for PATCH request", () => {
    const votes = { inc_votes: -97 };
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(201)
      .then(({ body: response }) => {
        expect(response.updated_article.votes).toBe(-97);
      });
  });
  test(" returns 400 bad request for a malformed request body", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(400)
      .then(({ body: response }) => {
        expect(response.msg).toBe("Error 400: Malformed request body.");
      });
  });
  test(" returns 400 bad request for a request body of wrong data type", () => {
    const votes = { inc_votes: "1" };
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(400)
      .then(({ body: response }) => {
        expect(response.msg).toBe("Error 400: Body has invalid data type.");
      });
  });
});

//tests for GET /api/users
describe(Endpoints.ALL_USERS_END, () => {
  test("returns an arr of correct length for user endpoint with correct http status code of 200", () => {
    return request(app)
      .get(Endpoints.ALL_USERS_END)
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

//tests for GET /api/articles
describe(Endpoints.ALL_ARTICLES_END, () => {
  test("returns a response object with value of a ray of article objects with http status code 200", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: rows }) => {
        rows.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("returns an array of length 12 indicating all articles returned", () => {
    return request(app)
      .get(Endpoints.ALL_ARTICLES_END)
      .expect(200)
      .then(({ body: rows }) => {
        const articles = rows.articles;
        expect(articles.length).toBe(12);
      });
  });
  //test is britte as depends on sort order foreach, get index of date = x then look at this one
  test.skip("articles with 0 comments return a value of 0 on comment_count", () => {
    return request(app)
      .get(Endpoints.ALL_ARTICLES_END)
      .expect(200)
      .then(({ body: rows }) => {
        const articles = rows.articles;
        expect(articles[0].comment_count).toBe(0);
      });
  });
  test("returned array is sorted by object key: created_at in descending date", () => {
    return request(app)
      .get(Endpoints.ALL_ARTICLES_END)
      .expect(200)
      .then(({ body: rows }) => {
        const articles = rows.articles;
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("returns http code 404 for a invalid route", () => {
    return request(app)
      .get("/api/articleInvaid")
      .expect(400)
      .then(({ body: response }) => {
        expect(response.msg).toBe("Error 400: Path invalid.");
      });
  });
});

describe(Endpoints.ALL_COMMENTS_BY_ARTICLE_ID, () => {
//tests for sorting by query strings
test('sort_by - returns objects sorted by valid column- default = created_at',() => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "")
  .expect(200)
  .then(({ body: rows }) => {
    const articles = rows.articles;
    expect(articles).toBeSorted({ key: "created_at", descending: true })
});
});
test('sort_by - returns objects sorted by valid column',() => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=author")
  .expect(200)
  .then(({ body: rows }) => {
    const articles = rows.articles;
    expect(articles).toBeSorted({ key: "author", descending: true })
});
});

test('order - returns objects sorted by valid column and a specified order, default = desc',() => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=article_id")
  .expect(200)
  .then(({ body: rows }) => {
    const articles = rows.articles;
    expect(articles).toBeSorted({ key: "article_id", descending: true })
});
});
test('order - returns objects sorted by valid column and a specified order',() => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=article_id&order=asc")
  .expect(200)
  .then(({ body: rows }) => {
    const articles = rows.articles;
    expect(articles).toBeSorted({ key: "article_id", descending: false })
});
});
test('topic - filters articles by article topic column', () => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=article_id&order=asc&topic=cats")
  .expect(200)
  .then(({ body: rows }) => {
    
    const articles = rows.articles;
    expect(articles).toBeSorted({ key: "article_id", descending: false });
    expect(articles.length).toBe(1);
    expect(articles[0].topic).toBe('cats');
   
})
});
test('topic - protects against sql injection', () => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=article_id&order=asc&topic=DROP*TABLES")
  .expect(403)
});
//400 might be better
test('rejects an invalid topic', () => {
  return request(app)
  .get(Endpoints.ALL_ARTICLES_END + "?sort_by=article_id&order=asc&topic=invalidtopic")
  .expect(403)
});
});


// tests for GET /api/articles/:article_id/comments
describe(Endpoints.ALL_COMMENTS_BY_ARTICLE_ID, () => {
  test("returns all comments for a given article id with http status code 200", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
      });
  });
  test("returns an array of objects; for which each object has the correct properties", () => {
    return (
      request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        //correct keys present
        .then(({ body: { comments } }) => {
          //correct number of  keys
          expect(Object.keys(comments[0]).length).toBe(5);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        })
    );
  });
  test("returns http status code 400 and a error message object for a article_id of invalid type", () => {
    return request(app)
      .get("/api/articles/invalidId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error 400: Not a valid id.");
      });
  });
  test("returns a http status code of 404 and a error message object for a id which is not found", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Error 404: No articles found for article_id 99999."
        );
      });
  });
  test("returns a empty array for valid article_id / no comments found", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: comments }) => {
        expect(comments.comments).toEqual([]);
      });
  });
});

//tests for POST/api/articles/:article_id/comments
describe(Endpoints.ALL_COMMENTS_BY_ARTICLE_ID, () => {
  test("returns posted comment and http status code of 201", () => {
    const newComment = { username: "hiroji", body: "merp!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: {comment} }) => {
       
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id : expect.any(Number)
          })
        );
      });
  });
  test("returns a http status code of 400 and a error message for if not posted an object with username and body", () => {
    const newComment = {};
    return request(app) 
    .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: err}) => {
        expect(err.msg).toBe("Error 400: Malformed request body.")
  })
});
test("returns a http status code of 400 and a error message for if not posted an object with username ", () => {
  const newComment = {body : "Test"};
  return request(app) 
  .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({ body: err}) => {
      expect(err.msg).toBe("Error 400: Malformed request body.")
})
});
test("returns a http status code of 400 and a error message for if not posted an object with username ", () => {
  const newComment = {username : undefined, body : "Test"};
  return request(app) 
  .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({ body: err}) => {
      expect(err.msg).toBe("Error 400: Malformed request body.")
})
});

test("returns a status code of 404 and an error message if sent a article id which does not exist", () => {
  const newComment = { username: "hiroji", body: "merp!" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: err}) => {
        expect(err.msg).toBe('Error 404: No articles found for article_id 9999.')
      });
});
test("returns a status code of 400 and an error message if sent a article id which is invalid", () => {
  const newComment = { username: "hiroji", body: "merp!" };
    return request(app)
      .post("/api/articles/invalidid/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: err}) => {
        expect(err.msg).toBe("Error 400: Not a valid id.")
      })
});
test("returns posted comment and http status code of 201 for existing user", () => {
  const newComment = { username: "lurker", body: "TEST" };
  return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body: {comment} }) => {
     
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id : expect.any(Number)
        })
      );
    });
});

});

//close connection to database
afterAll(() => {
  return db.end();
});
