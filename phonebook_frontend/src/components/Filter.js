import React from "react";

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter:
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

export default Filter;
