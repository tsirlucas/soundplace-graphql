require('dotenv').config();

const commonvars = {
  dbEndpoint: process.env.DATABASE_ENDPOINT,
  dbName: process.env.DATABASE_NAME,
};

const secrets = {
  dbPem: process.env.DATABASE_PEM,
  dbUser: process.env.DATABASE_USER,
  dbPassword: process.env.DATABASE_PASSWORD,
};

export const environment = {
  settings: commonvars,
  secrets: secrets,
};
