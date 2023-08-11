const express = require("express");
const config = require("./utils/config");
const app = express();
require("express-async-errors");
const cors = require("cors");
const BlogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

app.use(cors());
// app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", BlogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

/*

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

*/
