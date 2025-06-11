// src/config/neo4j.ts
import neo4j, { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

// Pull from env and guard against missing values:
const uri      = process.env.NEO4J_URI;
const user     = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  throw new Error(
    'Missing one of NEO4J_URI, NEO4J_USER or NEO4J_PASSWORD in environment'
  );
}

let driver: Driver;

// If the URI scheme includes “+s” or “+ssc” it already implies TLS/trust via URL,
// so we must NOT pass an encryption/trust config object.
if (/^(bolt\+s|neo4j\+s|bolt\+ssc):\/\//.test(uri)) {
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(user, password)
  );
} else {
  // Plain bolt:// → disable encryption & trust all (for local Docker/dev)
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(user, password),
    {
      encrypted: 'ENCRYPTION_OFF',
      trust:     'TRUST_ALL_CERTIFICATES'
    }
  );
}

export { driver };
