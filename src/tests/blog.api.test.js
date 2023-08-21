// const listHelper = require("../utils/list_helper");
const {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  testBlog,
} = require("./test_helper");

// const testHelper = require("../utils/testHelper");
// const { manyBlogs, listWithOneBlog } = require("./testValues.js");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog.js");
const User = require("../models/user");
let token = "";
const apiUrl = "/api/blogs";
const userUrl = "/api/users";
beforeAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  const loginInfo = {
    username: "admin",
    password: "password",
    name: "administrator",
  };
  await api.post("/api/users").send(loginInfo);
  const response = await api.post("/api/login").send(loginInfo);
  token = response.body.token;
}, 15000);

describe("Testing api get requests", () => {
  //
  test("blogs are returned as json", async () => {
    await api
      .get(apiUrl)
      // .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get(apiUrl);
    // .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("the first blog has the id property", async () => {
    const response = await api
      .get(apiUrl)
      .set("Authorization", `Bearer ${token}`);
    const IDs = response.body.map((blog) => blog.id);
    IDs.forEach((id) => {
      expect(id).toBeDefined();
    });
  });
});

describe("Testing api post requests", () => {
  test("a new blog post is created successfully", async () => {
    await api
      .post(apiUrl)
      .send(testBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newBlogList = await blogsInDb();
    expect(newBlogList.length).toBe(initialBlogs.length + 1);

    const titles = newBlogList.map((blog) => blog.title);
    expect(titles).toContain("This is a test");
  });

  test("a missing likes property is set to zero", async () => {
    const { likes, ...rest } = testBlog;
    const newObject = rest;

    const response = await api
      .post(apiUrl)
      .send(newObject)
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.likes).toBe(0);
  });

  test("missing title or url returns 400 (bad request)", async () => {
    const { url, ...noUrl } = testBlog;
    const { title, ...noTitle } = testBlog;
    await api
      .post(apiUrl)
      .send(noUrl)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    await api
      .post(apiUrl)
      .send(noTitle)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("No token returns 401 unauthorized", async () => {
    await api.post(apiUrl).send(testBlog).expect(401);
  });
});

describe("Testing api delete requests", () => {
  test("deleting a blog works successfully", async () => {
    const blogsAtStart = await blogsInDb();
    const blogObject = {
      title: "This blog is used for testing",
      author: "Michael",
      url: "google.com",
      likes: 0,
    };
    const postResponse = await api
      .post(apiUrl)
      .send(blogObject)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const sampleBlog = postResponse.body;
    const response = await api
      .delete(`${apiUrl}/${sampleBlog.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(sampleBlog.title);
  }, 10000);
});

describe("Testing api put requests", () => {
  test("updating a blog works and respond with 200 OK", async () => {
    const blogsAtStart = await blogsInDb();
    const initialBlog = blogsAtStart[1];
    const modifiedBlog = { ...initialBlog, likes: 25 };

    const response = await api
      .put(`${apiUrl}/${initialBlog.id}`)
      .send(modifiedBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const updatedBlog = response.body;
    expect(updatedBlog.likes).toBe(25);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
