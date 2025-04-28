const express = require("express")
const app = express()
const db = require("./db/connection")
const endpoints = require("./endpoints.json")
const { getTopics } = require("./app/controllers/topics.controller")


app.use(express.json())

app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpoints})
})

app.get("/api/topics", getTopics)

module.exports = app