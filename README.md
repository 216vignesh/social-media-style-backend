# Social-Backend-Neo4j

A minimal social-media-style backend built with Node.js, TypeScript and Neo4j.  
Supports user follow/unfollow graph, post creation & retrieval, and a home feed.

---

## 📋 Features

- **User Graph**  
  - Follow / unfollow users  
  - View followers & following lists

- **Posting**  
  - Create posts with text & optional media URL  
  - Retrieve your own posts  
  - Retrieve another user’s posts  
  - Home feed: posts by users you follow, with pagination

- **Authentication**  
  - JWT-based  
  - Register / login endpoints  

- **Testing**  
  - Automated integration tests with Jest & SuperTest  
  - Uses a throw-away Neo4j instance on `localhost:7687`  
  - Cleans database between test suites  

- **Dockerized**  
  - `docker-compose.yml` for local development  
  - `docker-compose.test.yml` for CI/test suite  

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+  
- **Language**: TypeScript  
- **Web framework**: Express.js (REST)  
- **DB**: Neo4j 4.x (Bolt driver)  
- **Auth**: JSON Web Tokens (JWT)  
- **Testing**: Jest, ts-jest, SuperTest, wait-on  
- **Containerization**: Docker, docker-compose  

---

## 📐 Data Model (Neo4j)

```cypher
// Ensure uniqueness (run once):
CREATE CONSTRAINT unique_user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE;
CREATE CONSTRAINT unique_user_username IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE;

// Users
// :User nodes with properties id, username, email, password (hashed), createdAt

// Follows relationship
// (a:User)-[:FOLLOWS]->(b:User)

// Posts
// :Post nodes with id, content, mediaUrl, createdAt
// (u:User)-[:POSTED]->(p:Post)


## Getting Started

1. Clone & Install

git clone <your-repo-url>
cd social-backend-neo4j
npm ci

2. Environment Variables
Copy the example and fill in your values:

cp .env.example .env

.env (for development / production / Docker)

PORT=4000
JWT_SECRET=your_jwt_secret

# When running with Docker Compose (app ↔ neo4j container)
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j_password

.env.test (for host-machine tests)


PORT=4000
JWT_SECRET=your_jwt_secret

# Tests connect to local Bolt port
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j_password
NODE_ENV=test

Running on Docker
docker-compose up --build

# API Endpoints

Base URL: http://localhost:4000/api

Auth
Method	Path	Body	Response
POST	/auth/register	{ username, email, password }	{ data: { id, token } }
POST	/auth/login	{ email, password }	{ data: { id, token } }

Users
All require Authorization: Bearer <token>

Method	Path	Response
POST	/users/:id/follow	{ data: "ok" }
DELETE	/users/:id/follow	{ data: "ok" }
GET	/users/:id/followers	{ data: [ { id, username } ] }
GET	/users/:id/following	{ data: [ { id, username } ] }


Posts & Feed
Create & “me” routes require auth

Method	Path	Body	Response
POST	/posts	{ content, mediaUrl? }	{ data: { postId } }
GET	/posts/me		{ data: [ Post ] }
GET	/posts/user/:id		{ data: [ Post ] }
GET	/posts/feed?limit=&skip=		{ data: [ Post ] }


# Feature Test cases
Feature Test Cases
Run these manually in Postman or via the automated suite:

Auth

Register new user → 201 + token

Duplicate email/username → 409 Conflict

Login valid → 200 + token

Login invalid → 401 Unauthorized

User Graph

Follow other user → 200

Follow self → 400

Unfollow not-following → 404 or 200 idempotent

Followers/following lists reflect relationships

Posts

Create with text only → 201

Create with media → 201

Missing content → 400

Fetch own & others’ posts → arrays sorted by createdAt

Feed

Empty feed when no follows → []

Feed shows only followees’ posts

Pagination via limit & skip

Protected: no token → 401

Error Handling & Edge Cases

Malformed JWT → 401

Large content payload

Script injection attempts stored as literal text

Concurrency: multiple follow requests remain idempotent
