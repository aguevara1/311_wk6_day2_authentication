require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

// for bcrypt
const saltRounds = 10

// const signup = (req, res) => {
//   const { username, password } = req.body
//   let sql = "INSERT INTO usersCredentials (username, password) VALUES (?, ?)"

//   bcrypt.hash(password, saltRounds, function(err, hash) {
//     sql = mysql.format(sql, [ username, hash ])
  
//     pool.query(sql, (err, result) => {
//       if (err) {
//         if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('Username is taken')
//         return handleSQLError(res, err)
//       }
//       return res.send('Sign-up successful')
//     })
//   })
// }

const url = 'https://hipperger.us.auth0.com/oauth/token'
const dataOBJ = {
    grant_type: 'client_credentials',
    audience: 'my-express-app',
    connection: 'Username-Password-Authentication',
    scope: 'openid',
    client_id: 'QEk1Jzy2d3RBL2qhu38Kn83gTu4PKsv0',
    client_secret: 'rbfu-vxIZyO6vjrZAFkJgNtWmzb8TrLgeLMAyzPvtHi9wRNqvsDJ-qS1UjpIWJMH' 
}

const login = (req, res) => {
  const { username, password } = req.body

  axios(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    data: {
      grant_type: "client_credentials",
      username: username,
      password: password,
      audience: process.env.AUTH0_IDENTITY,
      connection: 'Username-Password-Authentication',
      // scope: 'openid', <<<<<------- Delete!
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET
    }
  })
  .then(response => {
    const { access_token } = response.data
    res.json({
      access_token
    })
  })
  .catch(e => {
    console.log(e)
    res.send(e)
  })
}

module.exports = {
  login
}