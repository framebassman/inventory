exports.up = async (sql) => {
  await sql`
    CREATE TABLE app_settings(
      id INT GENERATED ALWAYS AS IDENTITY,
      key TEXT NOT NULL,
      value TEXT,
      PRIMARY KEY(id)
    );
  `;

  await sql`
    INSERT INTO app_settings (key, value)
    SELECT key, value
    FROM tenant_secrets
    WHERE key = 'private_key_id'
    LIMIT 1;
  `;

  await sql`
    INSERT INTO app_settings (key, value)
    SELECT key, value
    FROM tenant_secrets
    WHERE key = 'private_key'
    LIMIT 1;
  `;

  await sql`
    DELETE FROM tenant_secrets WHERE key = 'private_key_id';
  `;

  await sql`
    DELETE FROM tenant_secrets WHERE key = 'private_key';
  `;
};

exports.down = async (sql) => {
  await sql`
    INSERT INTO tenant_secrets (tenant_id, key, value)
    SELECT t.id, ts.key, ts.value
    FROM tenant_secrets ts
    INNER JOIN tenants t ON ts.tenant_id = t.id
    WHERE ts.key = 'private_key_id'
    LIMIT 1;
  `;

  await sql`
    INSERT INTO tenant_secrets (tenant_id, key, value)
    SELECT t.id, ts.key, ts.value
    FROM tenant_secrets ts
    INNER JOIN tenants t ON ts.tenant_id = t.id
    WHERE ts.key = 'private_key'
    LIMIT 1;
  `;

  await sql`drop table if exists app_settings`;
};
