const mysql = require('mysql');
const connexion = mysql.createConnection({
    host : 'localhost',
    // port : '8080',
    user : 'root',
    password : '',
    database : 'today-post',
})

connexion.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connexion;