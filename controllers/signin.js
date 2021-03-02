const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json('incomplete form submission')
    }
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash); // true
            if(isValid) {
                db.select('*')
                    .from('users')
                    .where('email', '=' , user[0].email)
                    .then(data => {
                        res.json(data[0])
                    })
                    .catch(err => res.status(400).json('unable to fetch user'))
            } else {
                res.status(400).json('Wrong Credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {handleSignin}