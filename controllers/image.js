const clarifai = require('clarifai')


const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
    const {input} = req.body;
    app.models
        .predict(
        Clarifai.FACE_DETECT_MODEL,
        input
    )
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(400).json("unable to call API")
    })

}


const handleImageEntries = (req, res, db) => {
    const {id} = req.body;
    db('users')
        .where({id: id})
        .increment('entries', 1)
        .returning('entries')
        .then(response => {
            if(response.length) {
                res.json(response[0]);
            } else {
                res.status(400).json('User Not Found')
            }
        }).catch(err => res.status(400).json("Error getting request"))
}


module.exports = {handleImageEntries, handleApiCall}