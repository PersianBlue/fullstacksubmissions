const BlogsRouter = require("express").Router();
const Blog = require("../models/blog.js");

// BlogsRouter.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

BlogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({});
  response.json(blogs);

  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

BlogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog).status(200);
});

BlogsRouter.post("/", async (request, response) => {
  const blogObject = request.body.likes
    ? request.body
    : { ...request.body, likes: 0 };

  const blog = new Blog(blogObject);

  if (!request.body.url || !request.body.title) {
    response.status(400).json({ error: "Bad request. Missing title or url" });
  }

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

BlogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
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
