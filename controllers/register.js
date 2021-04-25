const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json("incomplete form submission");
  }
  const hash = bcrypt.hashSync(password, 10);
  let ErrorMessage = "Unable to register";
  db.transaction((trx) => {
    db.insert({
      hash: hash,
      email: email,
    })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        db("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            // console.log(user)
            res.json(user[0]);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(ErrorMessage);
          });
      })
      .then(trx.commit)
      .catch((err) => {
        console.log(err);
        if (err.toString().includes("duplicate key value")) {
          ErrorMessage = "User Already Exists";
        }
        trx.rollback;
        res.status(400).json(ErrorMessage);
      });
  }).catch((err) => res.status(400).json(ErrorMessage));
};

module.exports = { handleRegister };
