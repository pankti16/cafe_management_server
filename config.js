//Config for holding database variables
const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectTimeout: 60000,
  }
};
module.exports = config;
