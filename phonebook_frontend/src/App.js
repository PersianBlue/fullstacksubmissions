import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import db from "./services/services";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [isError, setIsError] = useState(true);
  console.log("Rendering with", persons.length, "persons");

  const retrievePersons = () => {
    const eventHandler = (initialPersons) => {
      setPersons(initialPersons);
    };
    db.getAll()
      .then(eventHandler)
      .catch((error) => {
        console.log(error);
        alert(
          "There was an error retrieving the contacts. Please check your network connection."
        );
      });
  };
  const effectHook = () => {
    console.log("Running effect");
    retrievePersons();
  };

  useEffect(effectHook, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMsg} isError={isError} />
      <Filter filter={filter} setFilter={setFilter} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        persons={persons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setPersons={setPersons}
        setErrorMsg={setErrorMsg}
        setIsError={setIsError}
      />
      <h2>Contacts</h2>
      <Persons
        filter={filter}
        persons={persons}
        retrievePersons={retrievePersons}
        setErrorMsg={setErrorMsg}
        setIsError={setIsError}
      />
    </div>
  );
};

export default App;
