
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'bdteste',
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = pool