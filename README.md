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


## Getting Started

1. Clone & Install

git clone <your-repo-url>
cd <your-project-folder>
npm ci

2. Environment Variables
Copy the example and fill in your values:

cp .env.example .env

### .env (for development/ Docker - this env file should be used only when running on local Docker. For production, the apis are already deployed on render.)

PORT=4000
JWT_SECRET=your_jwt_secret
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j_password



### .env.test (this is for running test cases, so use this env file while doing npm test, this is also for localhost)
PORT=4000
JWT_SECRET=your_jwt_secret
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=neo4j_password
NODE_ENV=test



### Running on Docker
docker-compose up --build
Make sure to have your Docker Desktop open




## API Endpoints

Base URL: https://social-media-style-backend.onrender.com

Auth
Method	Path	Body	Response
POST	/api/auth/register	{ username, email, password }	{ data: { id, token } }
POST	/api/auth/login	{ email, password }	{ data: { id, token } }

Users
All require Authorization: Bearer <token>

Method	Path	Response
POST	/api/users/:id/follow	{ data: "ok" }
DELETE	/api/users/:id/follow	{ data: "ok" }
GET	/api/users/:id/followers	{ data: [ { id, username } ] }
GET	/api/users/:id/following	{ data: [ { id, username } ] }


Posts & Feed
Create & “me” routes require auth

Method	Path	Body	Response
POST	/api/posts	{ content, mediaUrl? }	{ data: { postId } }
GET	/api/posts/me		{ data: [ Post ] }
GET	/api/posts/user/:id		{ data: [ Post ] }
GET	/api/posts/feed?limit=&skip=		{ data: [ Post ] }


## Postman test settings

POSTMAN TESTING (steps)

1. Create Postman Environment “SocialAPI” with variables:
baseUrl = https://social-media-style-backend.onrender.com
userAId, userBId, tokenA, tokenB (empty)

2. Register User A
POST {{baseUrl}}/api/auth/register
Body { "username":"vignesh","email":"vignesh@example.com","password":"P@ssw0rd" }
Tests: save data.id → userAId, data.token → tokenA

3. Register User B similarly → save userBId and tokenB

4. Vignesh follows User B
POST {{baseUrl}}/api/users/{{userBId}}/follow
Header Authorization: Bearer {{tokenA}}

5. Verify User Bs followers
GET {{baseUrl}}/api/users/{{userBId}}/followers
Assert userAId in response

6. Vignesh unfollows user B
DELETE {{baseUrl}}/api/users/{{userBId}}/follow

7. Vignesh creates a post
POST {{baseUrl}}/api/posts
Header Authorization: Bearer {{tokenA}}
Body { "content":"Hello from Alice!","mediaUrl":null }

8. Fetch Vignesh's posts
GET {{baseUrl}}/api/posts/me
Authorization: Bearer {{tokenA}}

9. Fetch User B's posts
GET {{baseUrl}}/api/posts/user/{{userBId}}

10. Feed flow
• User B creates posts (use {{tokenB}})
• Vignesh follows User B again
• Vignesh GET {{baseUrl}}/api/posts/feed?limit=10&skip=0
• Assert User B's posts appear

11. Error cases
• Missing token → 401
• Invalid follow ID → 4xx
• Create post without content → 400


## Feature Test cases
Auth
• Register success (201)
• Duplicate registration (409)
• Login success (200)
• Login failure (401)
User Graph
• Follow/unfollow, self-follow, idempotent unfollow, list checks
Posts
• Create post with/without media, missing content error, retrieval
Feed
• Empty feed, correct posts after follow, pagination, auth required
