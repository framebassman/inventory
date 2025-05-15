DO
$do$
BEGIN
  IF NOT EXISTS (
      SELECT
  FROM pg_catalog.pg_roles
  WHERE  rolname = 'inventory-user') THEN

  CREATE ROLE store_user
  LOGIN PASSWORD 'KqCQzyH2akGB9gQ4';
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO store_user;
  ALTER ROLE store_user WITH CREATEDB;
END
IF;
END
$do$;

CREATE EXTENSION pgcrypto;
