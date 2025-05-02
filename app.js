const express = require("express")
const app = express()
const db = require("./db/connection")
const endpoints = require("./endpoints.json")
const { getTopics } = require("./app/controllers/topics.controller")
const { getArticleById, getArticlesSorted, patchArticle } = require("./app/controllers/articles.controller")
const { getCommentsUsingArticleId, postCommentByArticleId } = require("./app/controllers/comments.controller")

app.use(express.json())

app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticlesSorted)

app.get("/api/articles/:article_id/comments", getCommentsUsingArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticle)


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else if (err.code === "22P02") {
        res.status(400).send({msg: "Bad Request"})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})

module.exports = app