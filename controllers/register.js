const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body;
    if(!email || !password || !name) {
        return res.status(400).json('incomplete form submission')
    }
    const hash = bcrypt.hashSync(password, 10);
    db.transaction(trx => {
        trx.insert({
                hash:hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => {
                        // console.log(user)
                        res.json(user[0])
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json('Unable to register')
                    })
            })
            .then(trx.commit)
            .catch(err => {
                console.log(err)
                trx.rollback
                res.status(400).json('Unable to register')
            })
    })
    .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {handleRegister}