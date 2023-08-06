const listHelper = require("../utils/list_helper");
const testHelper = require("../utils/testHelper");
const { manyBlogs, listWithOneBlog } = require("./testValues.js");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

//----------------------//
//Total Likes
describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    testHelper(listHelper.totalLikes, manyBlogs, 36);
  });
});

//----------------------//

//favorite blogg
describe("favorite blog", () => {
  test("with no blogs is -1", () => {
    testHelper(listHelper.favoriteBlog, [], -1);
  });
  test("with one blog is that same blog", () => {
    const result = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    };
    testHelper(listHelper.favoriteBlog, listWithOneBlog, result);
  });

  test("with many blogs is the correct blog", () => {
    const result = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    testHelper(listHelper.favoriteBlog, manyBlogs, result);
  });
});

//----------------------//
//most blogs
describe("most blogs", () => {
  test("with no blogs is -1", () => {
    testHelper(listHelper.mostBlogs, [], -1);
  });
  test("with one blog is that same blog", () => {
    const result = {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    };
    testHelper(listHelper.mostBlogs, listWithOneBlog, result);
  });

  test("with many blogs is the correct blog", () => {
    const result = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    testHelper(listHelper.mostBlogs, manyBlogs, result);
  });
});
//---------------------------------
//----------------------//
//----------------------------------
//most likes
describe("most likes", () => {
  test("with no blogs is -1", () => {
    testHelper(listHelper.mostLikes, [], -1);
  });
  test("with one blog is that same blog", () => {
    const result = {
      author: "Edsger W. Dijkstra",
      likes: 5,
    };
    testHelper(listHelper.mostLikes, listWithOneBlog, result);
  });

  test("with many blogs is the correct blog", () => {
    const result = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    testHelper(listHelper.mostLikes, manyBlogs, result);
  });
});
