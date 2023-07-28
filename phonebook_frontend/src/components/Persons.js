import React from "react";
import Person from "./Person";
import db from "../services/services";

const Persons = ({
  filter,
  persons,
  retrievePersons,
  setIsError,
  setErrorMsg,
}) => {
  const removePerson = (person) => {
    console.log("Now removing person ", person.name);
    db.remove(person.id)
      .then((response) => {
        console.log(response);
        setIsError(false);
        setErrorMsg(`Successfully deleted  ${person.name}`);
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        retrievePersons();
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setErrorMsg(`Error while deleting ${person.name}`);
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
        retrievePersons();
      });
  };

  const handleDelete = (person) => {
    const handleError = () => {
      setIsError(false);
      setErrorMsg(`${person.name}  was not removed`);
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    };
    window.confirm(
      `Are you sure you want to delete ${person.name} from your contacts?`
    ) === true
      ? removePerson(person)
      : handleError();
  };

  const mapper = (person) => {
    // console.log(person.name);
    return (
      <>
        <Person person={person} key={person.id} handleDelete={handleDelete} />
      </>
    );
  };

  return (
    <div>
      {filter === ""
        ? persons.map(mapper)
        : persons
            .filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map(mapper)}
    </div>
  );
};

export default Persons;
