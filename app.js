const express = require("express")
const app = express()
const db = require("./db/connection")
const endpoints = require("./endpoints.json")
const {getApi} = require("./app/controllers/api.controller")

app.use(express.json())

app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpoints})
})


module.exports = app