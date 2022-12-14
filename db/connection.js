const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

//note for testing have coded package-json script to run dev environment not production
const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

    if (ENV !== "production") {
      require("dotenv").config({
        path: `${__dirname}/../.env.${ENV}`,
      });
    }

//note for testing have coded package-json script to run dev environment not production
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}


module.exports = new Pool(config);
