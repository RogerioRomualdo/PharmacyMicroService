require("dotenv").config();

const srcConfig = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["./src/infra/database/models/*.ts"],
};

const distConfig = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["./dist/src/infra/database/models/*{.ts,.js}"],
  migrations: ["./dist/src/infra/database/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/infra/database/migrations",
  },
};

module.exports =
  process.env.NODE_ENV === "development" ? srcConfig : distConfig;
