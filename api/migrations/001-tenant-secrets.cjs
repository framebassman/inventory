exports.up = async (sql) => {
  await sql`
    DROP TABLE IF EXISTS tenants;
  `;

  await sql`
    CREATE TABLE tenants(
      id INT GENERATED ALWAYS AS IDENTITY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at timestamp with time zone default now()
      PRIMARY KEY(customer_id)
    );
  `;

  await sql`
    CREATE TABLE tenant_secrets(
      id INT GENERATED ALWAYS AS IDENTITY,
      tenant_id INT,
      key TEXT NOT NULL,
      value TEXT,
      PRIMARY KEY(id),
      CONSTRAINT fk_tenant
          FOREIGN KEY(tenant_id)
            REFERENCES tenant(id)
    );
  `;
};

exports.down = async (sql) => {
  // My pre-configured "undo" function
  await sql`drop table if exists tenant_secrets`;

  await sql`
    create table if not exists tenants (
      id serial primary key,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      completed boolean default false,
      created_at timestamp with time zone default now()
    );
  `;
};
