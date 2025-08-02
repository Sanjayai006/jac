const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: '193.203.184.105',
    user: 'u280225344_69',
    password: 'u280225344_69U',
    database: 'u280225344_69',
});

export default connection;