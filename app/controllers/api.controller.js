const endpoints = require("../../endpoints.json")

exports.getApi = (request, response) => {
    return selectApi().then(() => {
      response.status(200).send(endpoints)  
    })
    
}

