const UsersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
UsersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

UsersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(user).status(200);
});

UsersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (password.length < 3) {
    response.status(400).json({
      error: "Bad request. Password must be at least 3 characters long.",
    });
  } else if (username.length < 3) {
    response.status(400).json({
      error: "Bad request. Username must be at least 3 characters long.",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  bcrypt;

  const userObject = {
    name,
    username,
    passwordHash,
  };

  const user = new User(userObject);
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = UsersRouter;
