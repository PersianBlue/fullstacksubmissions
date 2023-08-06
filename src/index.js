const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");
app.use(express.static("build"));

morgan.token("body", function (request, response) {
  const body = JSON.stringify(request.body);
  const return_string = body === "{}" ? "-no body found with request" : body;
  return return_string;
});

const customLogger = morgan(function (tokens, request, response) {
  //Do not change tokens.res or tokens.req to use the full name. They are not defined on the token object.
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
    tokens["body"](request, response),
  ].join(" ");
});

app.use(express.json());
app.use(customLogger);

const addPerson = async (name, number) => {
  const person = new Person({
    number: `${number}`,
    name: `${name}`,
  });

  const newPerson = await person.save().then((result) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    // mongoose.connection.close();
    return result;
  });
  console.log(newPerson);
  return newPerson;
};

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
      // response.json({ error: "An error occured in retrieving the persons" });
    });
});

app.get("/info", (request, response) => {
  Person.count({}).then((length) => {
    var line = "<p>Phonebook has info for " + length + " people</p>";
    line += `<p>${new Date()}</p>`;
    console.log(line);
    response.send(line);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.sendStatus(404).end();
      }
    })
    .catch((error) => next(error));
  // person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
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
  }

  addPerson(body.name, body.number)
    .then((newPerson) => {
      response.json(newPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
