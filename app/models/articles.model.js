const db = require("../../db/connection")

exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return result.rows[0]
    })
}

exports.selectArticlesSorted = (sort_by='created_at', order='desc') => {
    
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id`

    const sortByGreenList = [
        "created_at",
        "votes",
        "title",
        "topic",
        "author"
    ]
    const orderGreenList = [
        "asc",
        "desc"
    ]
    
    if (sort_by && !sortByGreenList.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }

    if (order && !orderGreenList.includes(order)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }

    queryStr += ` ORDER BY articles.${sort_by} ${order}`;

     return db
     .query(queryStr)
     .then((result) => {
        return result.rows
     })
}

exports.updateArticle = (article_id, inc_votes) => {
    return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, 
    [inc_votes, article_id])

    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return result.rows[0]
    })
}