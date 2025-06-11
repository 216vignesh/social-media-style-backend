import { driver } from '../config/neo4j';

export async function followUser(followerId: string, followeeId: string) {
  const session = driver.session();
  await session.run(
    `MATCH (a:User {id:$follower}), (b:User {id:$followee})
     MERGE (a)-[:FOLLOWS]->(b)`,
    { follower: followerId, followee: followeeId }
  );
  session.close();
}

export async function unfollowUser(followerId: string, followeeId: string) {
  const session = driver.session();
  await session.run(
    `MATCH (:User {id:$follower})-[r:FOLLOWS]->(:User {id:$followee}) DELETE r`,
    { follower: followerId, followee: followeeId }
  );
  session.close();
}

export async function getFollowers(userId: string) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:User {id:$id})<-[:FOLLOWS]-(f:User)
     RETURN f.id AS id, f.username AS username`,
    { id: userId }
  );
  session.close();
  return result.records.map(r => r.toObject());
}

export async function getFollowing(userId: string) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:User {id:$id})-[:FOLLOWS]->(f:User)
     RETURN f.id AS id, f.username AS username`,
    { id: userId }
  );
  session.close();
  return result.records.map(r => r.toObject());
}
