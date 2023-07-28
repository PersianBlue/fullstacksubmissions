const express = require("express");
const app = express();
const morgan = require("morgan");
const tiny = morgan("tiny");
app.use(express.static("build"));
morgan.token("body", function (req, res) {
  const body = JSON.stringify(req.body);
  const return_string = body === "{}" ? "-no body found with request" : body;
  return return_string;
});

const custom = morgan(function (tokens, req, res) {
  console.log(tokens.req);
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens["body"](req, res),
  ].join(" ");
});

app.use(express.json());
app.use(custom);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (req, res) => {
  const length = persons.length;
  var line = "<p>Phonebook has info for " + length + " people</p>";
  line += `<p>${new Date()}</p>`;
  console.log(line);
  res.send(line);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id == id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("Posting");
  if (!body.number) {
    console.log("No number in body");
    return response.status(400).json({
      error: "Phone number missing",
    });
  } else if (!body.name) {
    console.log("No name");
    return response.status(400).json({
      error: "Name missing",
    });
  } else if (persons.some((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "Name already exists. Name must be unique",
    });
  }

  const person = {
    number: body.number,
    name: body.name,
    id: Math.floor(Math.random() * 1000),
  };
  console.log(person);

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
