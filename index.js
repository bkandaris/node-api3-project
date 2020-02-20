// code away!
// first we have to set up our server
const express = require('express');
const server = express();
// setting up the port we want the server to run on
const port = process.env.PORT || 5000;

// importing our custom middleware logger function
const logger = require('./data/middleware/logger');

server.use(express.json());

// using our 'logger'
server.use(logger);
// still have to check this by hitting endpoints in the server

// bringing in our routers
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

// 'use' our routers
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.listen(port, () => {
  console.log(`server running on http://localhost${port}`);
});

module.exports = server;
