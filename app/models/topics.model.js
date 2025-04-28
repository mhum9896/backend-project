const db = require("../../db/connection")

exports.selectTopics = () => {
    return db
    .query(`SELECT description, slug FROM topics`)
    .then((result) => {
        return result.rows
    })
}