const { selectCommentsUsingArticleId, insertCommentByArticleId, removeCommentById } = require("../models/comments.model")

exports.getCommentsUsingArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    
    return selectCommentsUsingArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body

    if (!username || !body) {
        return next({status: 400, msg: "Bad Request"})
    }
    
    insertCommentByArticleId(article_id, username, body)
    .then((newComment) => {
      res.status(200).send({newComment});
    })
    .catch((err) => {
        if (err.code === "23503") {
            next({status: 404, msg: "Not Found"})
        }
      next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params

    return removeCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}