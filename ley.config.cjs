const { parse } = require('pg-connection-string');
require('dotenv').config();

const { host, port, database, user, password } = parse(
  process.env.WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE
);

module.exports = {
  host: host,
  port: port,
  database: database,
  username: user,
  password: password,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.AIVEN_CA
  }
};
