const { selectArticleById, selectArticlesSorted } = require("../models/articles.model")


exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })

}

exports.getArticlesSorted = (req, res) => {
    return selectArticlesSorted()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}