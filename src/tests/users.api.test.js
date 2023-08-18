const {
  initialUsers,
  nonExistingId,
  usersInDb,
  testUser,
} = require("./test_helper");

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

const apiUrl = "/api/users";
beforeAll(async () => {
  await User.deleteMany({});
  const userObjects = initialUsers.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
}, 12000);

describe("Testing api get requests", () => {
  //
  test("users are returned as json", async () => {
    await api
      .get(apiUrl)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get(apiUrl);

    expect(response.body).toHaveLength(initialUsers.length);
  });

  test("the first user has the id property", async () => {
    const response = await api.get(apiUrl);
    console.log(response.body);
    const IDs = response.body.map((user) => user.id);
    IDs.forEach((id) => {
      expect(id).toBeDefined();
    });
  });
});

describe("Testing user api post requests", () => {
  test("a new user is created successfully", async () => {
    await api
      .post(apiUrl)
      .send(testUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newUserList = await usersInDb();
    expect(newUserList.length).toBe(initialUsers.length + 1);

    const names = newUserList.map((user) => user.name);
    expect(names).toContain(testUser.name);
  });

  test("Password or username < 3 characters returns 400 (bad request)", async () => {
    const { password, ...noPassword } = testUser;
    const { username, ...noUsername } = testUser;
    noUsername.username = "ab";
    noPassword.password = "12";
    await api.post(apiUrl).send(noUsername).expect(400);
    await api.post(apiUrl).send(noPassword).expect(400);
  });
});
