const { selectTopics } = require("../models/topics.model")


exports.getTopics = (req, res) => {
    return selectTopics().then((topics) => {
        console.log(topics)
        res.status(200).send({topics})
    })
}