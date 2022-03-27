import React from "react";
import Map from "./components/Map";
import About from "./components/About";

export default function App() {
  return (
    <div>
      <div id="blurb">
        <h1><About /> Schoolpol: The Transformation of Post War Education</h1>
        <p>Project looking at how policies have affected education after World War II; this map shows
          how <abbr title="International Standard Classification of Education">ISCED</abbr> levels within countries, across time.
          Tap About for more.
        </p>
     </div>
     <Map />
    </div>
  );
}
