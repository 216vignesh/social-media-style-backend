// src/services/authService.ts
import { driver } from '../config/neo4j';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function register(username: string, email: string, password: string): Promise<string> {
  const session = driver.session();

  // check for existing email or username
  const exist = await session.run(
    `MATCH (u:User)
     WHERE u.email = $email OR u.username = $username
     RETURN u LIMIT 1`,
    { email, username }
  );
  if (exist.records.length > 0) {
    await session.close();
    throw { status: 409, message: 'User with this email or username already exists' };
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = uuid();

  await session.run(
    `CREATE (u:User {
       id: $id,
       username: $username,
       email: $email,
       password: $hash,
       createdAt: datetime()
     })`,
    { id: userId, username, email, hash }
  );

  await session.close();
  return userId;
}

export async function login(email: string, password: string): Promise<string> {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:User {email:$email})
     RETURN u.id AS id, u.password AS hash`,
    { email }
  );

  await session.close();

  if (result.records.length === 0) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const { id, hash } = result.records[0].toObject() as { id: string; hash: string };
  const match = await bcrypt.compare(password, hash);
  if (!match) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  return id;
}
