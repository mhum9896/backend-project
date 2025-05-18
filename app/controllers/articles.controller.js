const { selectArticleById, selectArticlesSorted, updateArticle } = require("../models/articles.model")


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

exports.getArticlesSorted = (req, res, next) => {
    const {sort_by, order, topic} = req.query

    return selectArticlesSorted(sort_by, order, topic)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    return updateArticle(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}