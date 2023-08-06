const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3] || null;
const number = process.argv[4] || null;

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://kristoff1331:${password}@fsocluster.l5cxolo.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  number: String,
  name: String,
});

const Person = mongoose.model("Person", personSchema);

const printPersons = (model) => {
  console.log("Phonebook:");
  model.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
};

// if (name && number) {
//   addPerson(name, number);
// } else if (!name && !number) {
//   printPersons(Person);
// }

// Note.find({ important: true }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
