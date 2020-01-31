const mysql = require('mysql')
const config = mysql.createConnection({
    host: 'mydb.tamk.fi',
    user: 'c7mheikk',
    password: 'xxxxxxxx',
    database: 'xxxxxxxx'
})

module.exports = config