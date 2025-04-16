const db = require("../connection")
const format = require("pg-format");
const articles = require("../data/test-data/articles")


const {convertTimestampToDate} = require("./utils")
const {articleRef} = require("./utils");
const comments = require("../data/test-data/comments");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
  .query('DROP TABLE IF EXISTS comments')
  .then(() => {
    return db.query('DROP TABLE IF EXISTS articles')
  })
  .then(() => {
    return db.query('DROP TABLE IF EXISTS users')
  })
  .then(() => {
    return db.query('DROP TABLE IF EXISTS topics')
  })
  .then(() => {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(200),
      img_url VARCHAR(1000))`
    )
    .then(() => {
      const formattedTopics = topicData.map((topics) => {
        return [topics.slug, topics.description, topics.img_url]
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(insertTopicsQuery)
    })
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100),
      avatar_url VARCHAR(1000)
      )`
    )
    .then(() => {
      const formattedUsers = userData.map((users) => {
        return [users.username, users.name, users.avatar_url]
      });
      const insertUsersQuery = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery)
    })
  })
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      topic VARCHAR(300) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      )`)
      .then(() => {
        const formattedArticles = articleData.map((article) => {
          const convertedArticle = convertTimestampToDate(article)
          return [article.title, article.topic, article.author, article.body, convertedArticle.created_at, article.votes, article.article_img_url]
        })
        const insertArticlesQuery = format(
          `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
          formattedArticles
        );
        return db.query(insertArticlesQuery)
      })
  })
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(500) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
      .then((result) => {
        const articlesRefObj = articleRef(result.rows)
        const formattedComments = commentData.map((comment) => {
          const convertedComment = convertTimestampToDate(comment)
          return [articlesRefObj[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          convertedComment.created_at]
        })
        const insertCommentQuery = format(
          `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`,
          formattedComments
        );

        return db.query(insertCommentQuery)
        
      })
  })
};

module.exports = seed;
