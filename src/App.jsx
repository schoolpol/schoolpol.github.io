import React from "react";
import Map from "./components/Map";
import Chooser from "./components/Chooser";

export default function App() {
  return (
    <div>
      <div id="blurb">
        <h1>Schoolpol: The Transformation of Post War Education</h1>
        <p>
          This project shows the educational attainments across 22 countries for
          10 variables.&nbsp;
          <a href="https://schoolpol.web.ox.ac.uk/home">Read more...</a>
        </p>
      </div>
      <Chooser />
      <Map />
    </div>
  );
}
