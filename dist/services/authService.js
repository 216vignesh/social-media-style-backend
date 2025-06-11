"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
// src/services/authService.ts
const neo4j_1 = require("../config/neo4j");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
async function register(username, email, password) {
    const session = neo4j_1.driver.session();
    // check for existing email or username
    const exist = await session.run(`MATCH (u:User)
     WHERE u.email = $email OR u.username = $username
     RETURN u LIMIT 1`, { email, username });
    if (exist.records.length > 0) {
        await session.close();
        throw { status: 409, message: 'User with this email or username already exists' };
    }
    const hash = await bcrypt_1.default.hash(password, 10);
    const userId = (0, uuid_1.v4)();
    await session.run(`CREATE (u:User {
       id: $id,
       username: $username,
       email: $email,
       password: $hash,
       createdAt: datetime()
     })`, { id: userId, username, email, hash });
    await session.close();
    return userId;
}
async function login(email, password) {
    const session = neo4j_1.driver.session();
    const result = await session.run(`MATCH (u:User {email:$email})
     RETURN u.id AS id, u.password AS hash`, { email });
    await session.close();
    if (result.records.length === 0) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    const { id, hash } = result.records[0].toObject();
    const match = await bcrypt_1.default.compare(password, hash);
    if (!match) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    return id;
}
