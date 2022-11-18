const express = require('express');
const usersRouter = express.Router();


const jwt = require("jsonwebtoken");


usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});
usersRouter.get('/', (req, res) => {
  res.send({
    users: []
  });
});

const { getAllUsers, getUserByUsername } = require('../db');

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please enter a username and password"
    });
  }
  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      res.send ({message: "You have been signed in"});
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Your username or password is incorrect"
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});



module.exports = usersRouter;