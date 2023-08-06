const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return -1;
  }
  //   var top = 0;
  //   blogs.forEach((blog) => {
  //     if (blog.likes >= top) {
  //       top = blog.likes;
  //     }
  //   });
  //   const topBlog = blogs.find((blog) => blog.likes === top);
  const topBlog = blogs.reduce((mostLikedBlog, blog) => {
    return blog.likes > mostLikedBlog.likes ? blog : mostLikedBlog;
  });

  return {
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return -1;
  }

  //get number of blogs for each author
  //get author with most blogs
  const numBlogs = {};
  blogs.forEach((blog) => {
    if (numBlogs[blog.author]) {
      numBlogs[blog.author] += 1;
    } else {
      numBlogs[blog.author] = 1;
    }
  });
  //blogsCount = {"ABCD": 3}
  //Object.entries(numBlogs) = [["abcd",3], ["EDW",4],...]
  const reducer = (bestAuthor, [currAuthor, currAuthorNumBlogs]) => {
    if (currAuthorNumBlogs > bestAuthor.blogs) {
      return { author: currAuthor, blogs: currAuthorNumBlogs };
    } else {
      return bestAuthor;
    }
    // return currAuthorNumBlogs > bestAuthor.blogs
    //   ? { currAuthor, currAuthorNumBlogs }
    //   : bestAuthor;
  };
  const mostBlogs = Object.entries(numBlogs).reduce(reducer, {
    author: "",
    blogs: 0,
  });
  console.log("Author with most blogs: ", mostBlogs);
  return {
    author: mostBlogs.author,
    blogs: mostBlogs.blogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return -1;
  }

  const authorLikes = {};
  //final structure: {"EWD": 5, "Charles": 10, ...}
  blogs.forEach((blog) => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes;
    } else {
      authorLikes[blog.author] = blog.likes;
    }
  });

  //Object.entries will produce [["EWD", 5], ["Charles", 10],...]
  const reducer = (bestAuthor, [currAuthorName, currAuthorNumLikes]) => {
    if (currAuthorNumLikes > bestAuthor.likes) {
      //return this as the new bestAuthor object for the next iteration
      return { author: currAuthorName, likes: currAuthorNumLikes };
    } else {
      //keep the previous bestAuthor for next iteration
      return bestAuthor;
    }
  };
  const mostLikedAuthor = Object.entries(authorLikes).reduce(reducer, {
    author: "",
    likes: 0,
  });
  console.log("Author with most blogs: ", mostBlogs);
  return {
    author: mostLikedAuthor.author,
    likes: mostLikedAuthor.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
