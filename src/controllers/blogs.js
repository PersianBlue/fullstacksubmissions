const BlogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

BlogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
    id: 1,
  });
  response.json(blogs);

  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

BlogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    name: 1,
    username: 1,
    id: 1,
  });
  response.json(blog).status(200);
});

BlogsRouter.post("/", async (request, response) => {
  if (!request.body.url || !request.body.title) {
    response.status(400).json({ error: "Bad request. Missing title or url" });
  }
  const blogObject = request.body.likes
    ? request.body
    : { ...request.body, likes: 0 };

  const user = request.user;
  blogObject.user = user.id;

  const blog = new Blog(blogObject);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  //don't change this from _id. there are some async issues with mongoose transforms
  response.status(201).json(savedBlog);
});

BlogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);
  if (!(blog.user.toString() === user.id)) {
    console.log(blog.user.toString());
    console.log(user.id);
    console.log("User ID did not match ID on blog");
    return response
      .status(400)
      .json({ error: "User not authorized to delete this blog." });
  }
  blog.deleteOne();

  // await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

BlogsRouter.put("/:id", async (request, response) => {
  const blog = { ...request.body };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(updatedBlog);
});

module.exports = BlogsRouter;
