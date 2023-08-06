const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
//REMEMBER TO SET THIS IN ENV PARAMETERS IN RENDER
mongoose.set("strictQuery", false);
mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^(0\d{1,2}|\d{2,3})-\d+$/.test(v);
        // return /(0\d{1,2}|\d{2,3})-\d+/
        // return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  name: { type: String, minLength: 3 },
});

const Person = mongoose.model("Person", personSchema);

const addPerson = (name, number) => {
  const person = new Person({
    number: `${number}`,
    name: `${name}`,
  });

  const newPerson = person.save().then((result) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
    return result;
  });
  return newPerson;
};

const printPersons = (model) => {
  console.log("Phonebook:");
  model.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
};

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
