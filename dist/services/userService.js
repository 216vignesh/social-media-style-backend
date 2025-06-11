"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.getFollowers = getFollowers;
exports.getFollowing = getFollowing;
const neo4j_1 = require("../config/neo4j");
async function followUser(followerId, followeeId) {
    const session = neo4j_1.driver.session();
    await session.run(`MATCH (a:User {id:$follower}), (b:User {id:$followee})
     MERGE (a)-[:FOLLOWS]->(b)`, { follower: followerId, followee: followeeId });
    session.close();
}
async function unfollowUser(followerId, followeeId) {
    const session = neo4j_1.driver.session();
    await session.run(`MATCH (:User {id:$follower})-[r:FOLLOWS]->(:User {id:$followee}) DELETE r`, { follower: followerId, followee: followeeId });
    session.close();
}
async function getFollowers(userId) {
    const session = neo4j_1.driver.session();
    const result = await session.run(`MATCH (u:User {id:$id})<-[:FOLLOWS]-(f:User)
     RETURN f.id AS id, f.username AS username`, { id: userId });
    session.close();
    return result.records.map(r => r.toObject());
}
async function getFollowing(userId) {
    const session = neo4j_1.driver.session();
    const result = await session.run(`MATCH (u:User {id:$id})-[:FOLLOWS]->(f:User)
     RETURN f.id AS id, f.username AS username`, { id: userId });
    session.close();
    return result.records.map(r => r.toObject());
}
