const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app")

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

//describe("GET /api/badEndpoint")

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with a slug and a description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
      expect(body.topics.length).toBe(3)
      body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          description: expect.any(String),
          slug: expect.any(String),
        })
      })
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: OK if article_id is correct and valid", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  
  test("400: Bad Request if article_id is not a number", () => {
    return request(app)
    .get("/api/articles/potato")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })

  test("404: Not Found if article_id is out of range", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with correct properties", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBe(13)
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
        })
      })
    })
  })
  test("200: Responds with array or article objects sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("created_at", {descending: true})
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comments from specicied article id", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments.length).toBe(2)
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number)
        })
      })
    })
  })
  test("200: Responds with an array of comments from specified article_id sorted by date with most recent comment first", () => {
    return request(app)
    .get("/api/articles/3/comments?sort_by=created_at")
    .expect(200)
      .then(({body}) => {
        expect(body.comments).toBeSortedBy("created_at", {descending: true})
      })
    })
  test("400: Bad Request if article_id is not a number", () => {
    return request(app)
    .get("/api/articles/potato/comments")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("404: Not Found if article_id is out of range", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("200: Responds with empty array if no comments available for specified article", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toEqual([])
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("200: Responds with comment added to specified article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(
      newComment)
    .expect(200)
    .then(({body}) => {
      expect(body.newComment).toMatchObject({
        author: "butter_bridge",
        body: "new comment",
        created_at: expect.any(String),
        votes: 0,
        article_id: 1,
        comment_id: expect.any(Number)
      })
    })
  })
  test("404: Responds with not found if author isn't valid", () => {
    const newComment = {
      username: "Dave",
      body: "new comment"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("404: Responds with Not Found when posting to article out of range", () => {
    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    }
    return request(app)
    .post("/api/articles/1000/comments")
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("400: Responds with Bad Request when posting with missing fields", () => {
    const newComment = {
      username: "",
      body: ""
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request if posted using invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "new comment"
    }
    return request(app)
    .post("/api/articles/potato/comments")
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})


describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated article with incremented votesfor specified article", () => {
    return request(app)
    .patch("/api/articles/3")
    .send({ inc_votes: 1 })
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject({
        article_id: 3,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 1,
        article_img_url: expect.any(String)
      })
    })
  })
  test("404: Responds with Not Found if article is out of range", () => {
    return request(app)
    .patch("/api/articles/79")
    .send({ inc_votes: 1 })
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("400: Responds with Bad Request if passed using invalid article id", () => {
    return request(app)
    .patch("/api/articles/potato")
    .send({ inc_votes: 1 })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: Responds with Bad Request if given invalid number", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: "X" })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})