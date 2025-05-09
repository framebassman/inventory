const { parse } = require('pg-connection-string');
require('dotenv').config();

const { host, port, database } = parse(
  process.env.WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE
);

module.exports = {
  host: host,
  port: port,
  database: database,
  username: process.env.MIGRATIONS_USERNAME,
  password: process.env.MIGRATIONS_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.MIGRATIONS_CA
  }
};
