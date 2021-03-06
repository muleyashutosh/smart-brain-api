const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex');


const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleProfileGet } = require('./controllers/profile');
const { handleImageEntries, handleApiCall } = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    }
});


const app = express()

app.use(cors())
app.use(express.json())




// GET --> returns all users
app.get('/', (req, res) => {res.json("It's working")})

// POST --> check user signin creds and login
app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)})

// POST --> add user to the database
app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)})


// GET --> to get profile data of a user using its ID
app.get('/profile/:id', (req, res) => {handleProfileGet(req, res, db)})

// PUT --> update the entries of a user by ID
app.put('/image', (req, res) => {handleImageEntries(req, res, db)})

// POST --> handle the apiCall to Clarifai and get responses
app.post('/imageApi', (req, res) => {handleApiCall(req, res)})


const PORT = process.env.PORT || 3000;
// Listening on Port 3000
app.listen(PORT, () => {
    console.log(`Node is running on port ${PORT}`)
})