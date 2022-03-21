import React from "react";

class Chooser extends React.Component {
  render() {
    return (
      <div id="chooser">
        <p>Select a country to get started ⟶</p>
        <select name="country" id="country">
          <option value="UK">United Kingdom</option>
        </select>
        <select name="variables" id="variables">
          <option value="ed_isced_6to8">ISCED 6 - 8</option>
        </select>
        <select name="gender" id="gender">
          <option value="">All genders</option>
          <option value="_f">Female</option>
          <option value="_m">Male</option>
        </select>
        <input
          type="range"
          min="1"
          max="100"
          defaultValue="50"
          className="slider"
          id="year"
        />
      </div>
    );
  }
}

export default Chooser;
