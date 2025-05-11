exports.up = async (sql) => {
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

exports.down = async (sql) => {
  // My pre-configured "undo" function
  await sql`drop table if exists tenants`;
};
