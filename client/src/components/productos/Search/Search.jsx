// Search.jsx
import React from "react";
import "./search.css";
import { BiSearch } from "react-icons/bi";

const Search = ({ value, onChange }) => {
  return (
    <div className="search">
      <div className="icon-search">
        <BiSearch    />
      </div>
      <div>
        <input
        className="input-search"
          type="text"
          placeholder="Search..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Search;
