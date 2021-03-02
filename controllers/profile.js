const handleProfileGet = (req, res, db) => {
    const {id} = req.params;
    db.select('*').from('users').where({id: id})
        .then(response => {
            if(response.length) {
                res.json(response[0])            
            } else {
                res.status(400).json('User Not Found')
            }
        })
        .catch(err => res.json(400).send('Error getting request'))
}

module.exports = {handleProfileGet}