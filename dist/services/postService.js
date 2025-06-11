"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getPostsByUser = getPostsByUser;
exports.getFeed = getFeed;
const neo4j_1 = require("../config/neo4j");
const uuid_1 = require("uuid");
const neo4j_driver_1 = require("neo4j-driver");
async function createPost(authorId, content, mediaUrl) {
    const session = neo4j_1.driver.session();
    const postId = (0, uuid_1.v4)();
    await session.run(`MATCH (u:User {id:$author})
     CREATE (p:Post {id:$postId, content:$content, mediaUrl:$mediaUrl, createdAt: datetime()})
     CREATE (u)-[:POSTED]->(p)`, { author: authorId, postId, content, mediaUrl: mediaUrl || null });
    session.close();
    return postId;
}
async function getPostsByUser(userId) {
    const session = neo4j_1.driver.session();
    const result = await session.run(`MATCH (:User {id:$id})-[:POSTED]->(p:Post)
     RETURN p {.id, .content, .mediaUrl, createdAt: toString(p.createdAt)} 
     ORDER BY p.createdAt DESC`, { id: userId });
    session.close();
    return result.records.map(r => r.get('p'));
}
async function getFeed(userId, limit = 20, skip = 0) {
    const session = neo4j_1.driver.session();
    const result = await session.run(`MATCH (:User {id:$id})-[:FOLLOWS]->(:User)-[:POSTED]->(p:Post)
     RETURN p {.id, .content, .mediaUrl, createdAt: toString(p.createdAt)}
     ORDER BY p.createdAt DESC
     SKIP $skip LIMIT $limit`, { id: userId, skip: (0, neo4j_driver_1.int)(skip), limit: (0, neo4j_driver_1.int)(limit) });
    session.close();
    return result.records.map(r => r.get('p'));
}
