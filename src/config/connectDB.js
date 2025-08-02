const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: '193.203.184.175',
    user: 'u974440670_jackpot',
    password: 'U974440670_jackpot',
    database: 'u974440670_jackpot',
});

export default connection;