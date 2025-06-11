import { driver } from './src/config/neo4j';

beforeAll(async () => {
  
  const session = driver.session();
  await session.run('MATCH (n) DETACH DELETE n');
  await session.close();
});

