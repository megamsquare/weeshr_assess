# Title: Mid-Level Node Backend Developer Technical Assessment
This project is to create APIs that involves the user register and login in order to create/update/delete a blog, while having an API that is open to all which will get all blogs or get the blog by the blog ID.

### Setup and installation
Make sure you have your docker running, because this api runs on Docker for database and environment control.

To initialize this API, run

```bash
docker-compose up -d
```

it will run on http://localhost:3001

## API Endpoints

### POST /api/v1/auth/register

Create a user

#### Request

- Method: POST
- Path: /api/v1/auth/register
- Request Body: The user name and password is requested

Example of Request body:
{
    "username": "user",
    "password": "user"
}

Response

Status Code: 201 (CREATED)

### POST /api/v1/auth/login

Login user

#### Request

- Method: POST
- Path: /api/v1/auth/login
- Request Body: The user name and password is requested

Example of Request body:
{
    "username": "user",
    "password": "user"
}

Response

Status Code: 201 (CREATED)
Response Body: This will return an accessToken which user will use to access create/update/delete of post.

### POST /api/v1/blog

User creates Blog

#### Request

- Method: POST
- Path: /api/v1/blog
- Request Body: The login user with token can created a blog by passing authorization to header

Example of Request body:
{
  "title": "Blog title",
  "content": "Blog content",
  "author": "UserId of the creator"
}

Response

Status Code: 201 (CREATED)
Response Body: This will return the information of the created blog.

### GET /api/v1/blog

Blog list request

#### Request

- Method: GET
- Path: /api/v1/blog
- Request Body: No request for this endpoint

Example of Request body:
None

Response

Status Code: 200 (OK)
Response Body: This will return the list of blogs in the system.

### GET /api/v1/blog/:id

Get Blog by blog id

#### Request

- Method: POST
- Path: /api/v1/blog/:id
- Request Body: This gets the blog id in the parameter

Example of Request body:
NONE

Response

Status Code: 200 (OK)
Response Body: This will return blog information that belong to the id passed in the parameter.

### PUT /api/v1/blog/:id

Login user Updates Blog by blog id

#### Request

- Method: PUT
- Path: /api/v1/blog/:id
- Request Body: This update the blog by passing blog id in the parameter, and can only be done when a user has accessToken, The user must also be the author of the blog before updating.

Example of Request body:
{
  "title": "Blog title",
  "content": "Blog content"
}

Response

Status Code: 200 (OK)
Response Body: This will returns the updated blog information that belong to the id passed in the parameter.

#### Request

- Method: POST
- Path: /api/v1/blog/:id
- Request Body: This gets the blog id in the parameter

Example of Request body:
NONE

Response

Status Code: 200 (OK)
Response Body: This will return blog information that belong to the id passed in the parameter.

### DELETE /api/v1/blog/:id

Login user Updates Blog by blog id

#### Request

- Method: DELETE
- Path: /api/v1/blog/:id
- Request Body: This delete the blog by passing blog id in the parameter, and can only be done when a user that has accessToken, The user must also be the author of the blog before deleting.

Example of Request body:
None

Response

Status Code: 200 (OK)
Response Body: This will returns the deleted blog information that belong to the id passed in the parameter.

### Testing
To test, you need to run the below syntax in your terminal:

```bash
npm test
```

### Swagger documentation
You can visit the api documentation when you run the server at `http://localhost:3001/api-docs`

### Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Dotenv
- Http-status
- Typescript
- Jest
- Supertest
- Ts-node
- Swagger

### Stop Project
To stop the project, you can run the below command in the terminal.

```bash
docker-compose down
```

- Note:The test only runs for register and login user,  