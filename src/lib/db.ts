const { Pool } = require("pg");

const conn = new Pool({
  connectionString: process.env.POSTGRES_URL_RENDER,
  ssl: process.env.POSTGRES_URL_RENDER ? true : false,
});

export default conn;
