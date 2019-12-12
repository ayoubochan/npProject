const connexion = require('./conf')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser');
const session = require('express-session')
let ssn = false;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({secret: 'secret'}))

app.post('/register', function (req, res, next) {
  let value = req.body;
  connexion.query('SELECT email FROM users', (err, response) => {
    if(err) throw err
    else {
      for(let i = 0; i < response.length; i++) {
        if(response[i].email === value.email) return res.sendStatus(500)
      }
      connexion.query(`INSERT INTO users (first_name, last_name, email, password, status, avatar) VALUES ('${value.firstName}', '${value.lastName}', '${value.email}', '${value.password}', 'member', 'http' )`, (err, response) => {
        if(err) throw err
        else {
          res.sendStatus(200)
        }
      })
    }
  })
});

app.post('/connect', function (req, res, next) {
  ssn = req.session
  let value = req.body;
  connexion.query(`SELECT first_name, last_name, password, avatar FROM users WHERE email='${value.email}'`, (err, response) => {
    if(err) throw err
    else if(response[0]) {
      console.log(response, value)
      if(response[0].password === value.password) {
        ssn.email = value.email
        res.json({
          firstName: response[0].first_name,
          lastName: response[0].last_name,
          avatar: response[0].avatar,
          type: response[0].status
        })
      } else {
        res.sendStatus(500)
      }
    } else {
      res.sendStatus(500)
    }
  })
});

app.get('/status', (req, res) => {
  if(ssn) {
    connexion.query(`SELECT first_name, last_name, avatar, status FROM users WHERE email='${ssn.email}'`, (err, response) => {
      res.json({
        firstName: response[0].first_name,
        lastName: response[0].last_name,
        avatar: response[0].avatar,
        type: response[0].status
      })
    })
  } else {
    res.json('false')
  }
})

app.post('/deconnect', (req, res) => {
  ssn = false
  res.json(ssn)
})


server.listen(8080);