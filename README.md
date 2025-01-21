
# README

## Project Overview

This project is a web server running on port **8080**. It serves an HTML page and supports multiple endpoints for users, posts, tokens, and other resources. You can interact with these endpoints through HTTP requests.

### URL Filtering Integration

The project integrates with a separate server to maintain a list of blocked URLs. Every time a post is uploaded, the server checks that no URLs in the post are part of the blocked list.

To enable this feature, ensure you run the **Foobar Bloom Filter** server from the repository located at:

[github.com/YZohar8/Foobar-Bloom-filter/tree/part-4](https://github.com/YZohar8/Foobar-Bloom-filter/tree/part-4)

Follow these steps to start the blocked URL server:

1. Clone the repository:
   ```bash
   git clone https://github.com/YZohar8/Foobar-Bloom-filter.git
   cd Foobar-Bloom-filter
   git checkout part-4
   ```

and run the bloom-filter-server.
---

## Prerequisites

Before running the server, make sure you meet the following requirements:

### 1. **Install MongoDB**

MongoDB is required to store data for the project. You can either use a local MongoDB server or a cloud-based instance (e.g., MongoDB Atlas).

- **Local MongoDB**: Download and install MongoDB from the [official website](https://www.mongodb.com/try/download/community).
- **MongoDB Atlas**: Alternatively, you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to set up a cloud-based database. If you use MongoDB Atlas, update the `CONNECTION_STRING` in the `.env` file accordingly.

---

### 2. **Create `.env` Configuration File**

The `.env` file stores important environment variables for your application. Follow the instructions below to create the file:

1. **Run the `setupConfig` script** to generate the necessary configuration files:
   
   ```bash
   node setupConfig.js
   ```

   This will create a `config` directory and place the `.env` file in it. The `.env` file should contain the following variables:

   ```env
   # Database Connection
   CONNECTION_STRING=mongodb://localhost:27017/foobar
   
   # Port for the server
   PORT=8080

   # Node environment (development/production)
   NODE_ENV=development

   # JWT Secret key for authentication
   JWT_SECRET=your_secret_key_here

   PORT_BLOOM_FILTER=8081
   HOST_BLOOM_FILTER='127.0.0.1'

   ```

2. **Important**: Replace the `CONNECTION_STRING` and `HOST_BLOOM_FILTER` with your actual database connection string, especially if you're using a cloud instance like MongoDB Atlas.

---

### 3. **Install Project Dependencies**

Once you have the `.env` file in place, you will need to install the project dependencies. Run the following command in your terminal:

```bash
npm install
```

This will install all the required libraries for the project to run.

### 4. **MongoDB Server Setup**

Make sure your MongoDB server is running:

- If you're using a **local MongoDB server**, ensure it’s running on port `27017` (default).
- If you're using **MongoDB Compass**, ensure you’ve updated your `.env` file with the correct connection string.

---

## Running the Server

### 1. **Populate the Database (Optional)**

If your MongoDB database is empty and you would like to preload some data, run:

```bash
node reload.js
```

This step is optional and only needed if you want to populate the database with initial data.

### 2. **Start the Server**

To start the server, use the following command:

```bash
node app.js
```

The server will start and listen on the port defined in your `.env` file (default is `8080`).

You should see the following output if everything is set up correctly:

```
Server is running on port 8080
MongoDB connected
```

---

## Server Endpoints

The server provides several routes for interacting with users, posts, and other resources. Here's a breakdown of the main API routes:

### **Main Route Splits**:

```javascript
router.use("/users", userRouter);
router.use("/tokens", tokenRouter);
router.use("/posts", postRouter);
router.use("/friends", friendsRouter);
router.use("/likes", likesRouter);
router.use("/comments", commentsRouter);
```

### `/users` - User Account Operations

#### Endpoints:
- `POST /`: Register a new user.
- `DELETE /`: Delete the authenticated user.
- `PATCH /`: Update the authenticated user's details.
- `GET /:id`: Get the details of a specific user by ID.

---

### `/tokens` - Token Operations

#### Endpoints:
- `POST /`: Create a new token (e.g., for user authentication).
- `GET /check`: Verify if a token is valid.

---

### `/posts` - Post Operations

#### Endpoints:
- `POST /search`: Search for posts based on user and criteria.
- `POST /search/all`: Global search for posts.
- `GET /all/:id`: Get all posts by a specific user.
- `POST /:id`: Create a new post for a specific user.
- `GET /:id`: Get posts for one specific user.
- `PATCH /:postId`: Update a specific post (only if the authenticated user is the author).
- `DELETE /:postId`: Delete a specific post (only if the authenticated user is the author).
- `/:postId/comments`: Manage comments for a specific post.

---

### `/friends` - Friendship Operations

#### Endpoints:
- `GET /approved/:userId`: Get the list of approved friends for a user.
- `GET /pending`: Get a list of pending friend requests.
- `GET /status/:friendId`: Check the friendship status with a specific user.
- `PATCH /:friendId`: Accept or reject a friend request.

---

### `/likes` - Post Like Operations

#### Endpoints:
- `PATCH /:postId`: Like or unlike a specific post.
- `GET /:postId`: Check if the authenticated user has liked a specific post.

---

### `/comments` - Comment Operations

#### Endpoints:
- `DELETE /:commentId`: Delete a specific comment (only if the authenticated user is the author).
- `PATCH /:commentId`: Update a specific comment (only if the authenticated user is the author).
- `POST /`: Create a new comment for a post.
- `GET /`: Get all comments for a specific post.

---

## Notes

- **Authentication**: Routes that require authentication use JWT tokens. The token should be passed in the `Authorization` header for protected routes.
  
  Example:
  ```bash
  Authorization: Bearer <your_jwt_token>
  ```

- **Middleware**: The application uses middleware to validate requests and ensure that users are authenticated and authorized to access specific routes.

---

## Additional Information

- **JWT Secret**: The JWT secret key is defined in the `.env` file (`JWT_SECRET`). Be sure to change this secret to something unique for your application.
- **Environment**: The project uses the `NODE_ENV` variable to distinguish between development and production environments. Set this appropriately in your `.env` file.

---

## Troubleshooting

- **MongoDB Connection Issues**: If you receive connection errors to MongoDB, make sure your `CONNECTION_STRING` in `.env` is correct and MongoDB is running (either locally or on MongoDB Atlas).
- **Port Issues**: If port `8080` is already in use, change the `PORT` value in the `.env` file to another available port.

---

## Enjoy Using the Project!

This project is designed to be a full-stack application with backend routes for user management, posts, comments, and more. Use the above API routes to integrate with your frontend or customize as needed.
