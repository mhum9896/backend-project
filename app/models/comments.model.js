const db = require("../../db/connection")

exports.selectCommentsUsingArticleId = (article_id) => {
    return db
    .query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC`,
    [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return db
            .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
            .then((articleComments) => {
                if(articleComments.rows.length === 0) {
                    return Promise.reject({status: 404, msg: "Not Found"})
                }
                else return []
            })
        }
        return result.rows
    })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    return db
    .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, body, article_id]
    )
    .then((result) => {
        return result.rows[0]
    })
}

exports.removeCommentById = (comment_id) => {
    return db
    .query(
        `DELETE FROM comments where comment_id = $1 RETURNING *`,
        [comment_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
    })
}