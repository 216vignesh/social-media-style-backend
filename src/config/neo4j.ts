import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const uri      = process.env.NEO4J_URI!;
const user     = process.env.NEO4J_USER!;
const password = process.env.NEO4J_PASSWORD!;

export const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password),
  {
    encrypted: 'ENCRYPTION_OFF',
    trust:     'TRUST_ALL_CERTIFICATES'
  }
);
