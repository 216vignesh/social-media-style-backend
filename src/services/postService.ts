import { driver } from '../config/neo4j';
import { v4 as uuid } from 'uuid';
import { int } from 'neo4j-driver';
export async function createPost(authorId: string, content: string, mediaUrl?: string) {
  const session = driver.session();
  const postId = uuid();
  await session.run(
    `MATCH (u:User {id:$author})
     CREATE (p:Post {id:$postId, content:$content, mediaUrl:$mediaUrl, createdAt: datetime()})
     CREATE (u)-[:POSTED]->(p)`,
    { author: authorId, postId, content, mediaUrl: mediaUrl || null }
  );
  session.close();
  return postId;
}

export async function getPostsByUser(userId: string) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (:User {id:$id})-[:POSTED]->(p:Post)
     RETURN p {.id, .content, .mediaUrl, createdAt: toString(p.createdAt)} 
     ORDER BY p.createdAt DESC`,
    { id: userId }
  );
  session.close();
  return result.records.map(r => r.get('p'));
}

export async function getFeed(userId: string, limit = 20, skip = 0) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (:User {id:$id})-[:FOLLOWS]->(:User)-[:POSTED]->(p:Post)
     RETURN p {.id, .content, .mediaUrl, createdAt: toString(p.createdAt)}
     ORDER BY p.createdAt DESC
     SKIP $skip LIMIT $limit`,
    { id: userId, skip: int(skip), limit: int(limit) }
  );
  session.close();
  return result.records.map(r => r.get('p'));
}
