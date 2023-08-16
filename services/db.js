const mysql = require("mysql2/promise");
const config = require("../config");

//Create database query connection
async function query(sql, params) {
  try {
    const connection = await mysql.createConnection(config.db);
    const [results] = await connection.execute(sql, params);

    return results;
  } catch (e) {
    console.log(e);
  }
}

// async function pool() {
//   try {
//     const pool = mysql.createPool({
//       ...config.db,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     const promisePool = pool.promise();
//     return promisePool;
//   } catch (e) {
//     console.log(e);
//   }
// }

module.exports = {
  query,
  // pool
};
