const express = require("express")
const app = express()
const db = require("./db/connection")
const endpoints = require("./endpoints.json")
const { getTopics } = require("./app/controllers/topics.controller")
const { getArticleById } = require("./app/controllers/articles.controller")


app.use(express.json())



app.get("/api", (req, res) => {
    res.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)


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

module.exports = app