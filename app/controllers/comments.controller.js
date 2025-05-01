const { selectCommentsUsingArticleId } = require("../models/comments.model")

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