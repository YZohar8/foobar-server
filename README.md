# README

## Project Overview

This project is a web server running on port **8080**. When a user navigates to the server's URL in their browser, the server serves an HTML page for the application.

---

## Prerequisites

Before running the server, you need to ensure the following requirements are met:

1. Create an `.env` file in the root directory of the project with the following variables:

```env
# Connect to database
CONNECTION_STRING=mongodb://localhost:27017/foobar
# Uncomment and use the below line if connecting to a cloud MongoDB instance
# CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Port for the server
PORT=8080

# Node environment
NODE_ENV=development

# Secret for JWT authentication
JWT_SECRET=secret2548567589gtyr
```

### Explanation of `.env` Variables:
- **CONNECTION_STRING**: The connection string for the MongoDB database. Ensure this is correct before running the application.
- **PORT**: The port on which the server will run. Default is set to `8080`.
- **NODE_ENV**: Specifies the environment (e.g., `development`, `production`).
- **JWT_SECRET**: The secret key used for signing JSON Web Tokens.

⚠️ **Important**: Verify that the `CONNECTION_STRING` is correct, as this is critical for the application to connect to the database.

---

## Running the Server

### Step 1: Populate the Database (Optional)
If the database is empty, you can preload data by running:
```bash
node reload.js
```

### Step 2: Start the Server
To start the server, run:
```bash
node app.js
```

---

## Server Endpoints

The server supports the following main routes:

### Main Route Splits
```javascript
router.use("/users", userRouter);
router.use("/tokens", tokenRouter);
router.use("/posts", postRouter);
router.use("/friends", friendsRouter);
router.use("/likes", likesRouter);
router.use("/comments", commentsRouter);
```

Below is a detailed explanation of each route and its functionality.

---

### `/users`
Handles operations related to user accounts.

#### Available Endpoints:
- `POST /`: Register a new user.
- `DELETE /`: Delete the authenticated user.
- `PATCH /`: Update the authenticated user's details.
- `GET /:id`: Get the details of a specific user by their ID.

---

### `/tokens`
Handles token-related operations.

#### Available Endpoints:
- `POST /`: Create a new token (e.g., for user authentication).
- `GET /check`: Verify the validity of a token.

---

### `/posts`
Handles posts and related operations.

#### Available Endpoints:
- `POST /search`: Get posts for a specific user with search criteria.
- `POST /search/all`: Search for posts globally.
- `GET /all/:id`: Get all posts by a specific user ID.
- `POST /:id`: Create a post for a specific user.
- `GET /:id`: Get posts for one specific user.
- `PATCH /:postId`: Update a specific post (only if the authenticated user is the author).
- `DELETE /:postId`: Delete a specific post (only if the authenticated user is the author).
- `/:postId/comments`: Nested route to manage comments on a specific post.

---

### `/friends`
Handles friend-related operations.

#### Available Endpoints:
- `GET /approved/:userId`: Get the friend list of a user.
- `GET /pending`: Get a list of pending friend requests.
- `GET /status/:friendId`: Get the status of a friendship with a specific user.
- `PATCH /:friendId`: Update the friendship status (e.g., accept or reject a friend request).

---

### `/likes`
Handles likes for posts.

#### Available Endpoints:
- `PATCH /:postId`: Update the like status for a specific post.
- `GET /:postId`: Check if the authenticated user has liked a specific post.

---

### `/comments`
Handles comments on posts.

#### Available Endpoints:
- `DELETE /:commentId`: Delete a specific comment (only if the authenticated user is the author).
- `PATCH /:commentId`: Update a specific comment (only if the authenticated user is the author).
- `POST /`: Create a new comment.
- `GET /`: Retrieve all comments for a specific post.

---

## Notes
- Authentication middleware is used extensively to secure the endpoints. For example, `authToken.authenticateToken` ensures that only authenticated users can access the routes.
- Additional middlewares like `authUser.userIsAuthorComments` or `authUser.verifyReqUserIsUser` validate permissions for certain operations.

Enjoy using the project!

