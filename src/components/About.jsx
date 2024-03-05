import React from "react";
import Popup from "reactjs-popup";

const About = () => (
  <Popup trigger={<button className="button">About</button>} modal>
    <div id="aboutmodal">
    <p>
    <strong>Schoolpol: The Transformation of Post-War Education</strong>
    &nbsp;is a project based at the
    &nbsp;<a href="https://www.politics.ox.ac.uk">Department of Political Science</a>&nbsp;
    at Oxford, which looks at how policies have affected education after the second
      world war. We look at <strong>21</strong> countries across a range of factors.
    </p>
    <p>This map visualises the&nbsp;
      <a href="http://uis.unesco.org/en/topic/international-standard-classification-education-isced">
        International Standard Classification of Education (ISCED)
      </a> levels for these countries. We look at three levels: ISCED 0 - 2, 3 - 5, 6 - 8
      which you can select in the dropdown. The data can also be visualised by gender
      and across time.
    </p>
    <p class="button">
      <a href="https://schoolpol.web.ox.ac.uk">Visit the project website →</a>
    </p>
    <p class="escape">
      <span style={{color: "#555", fontSize: "small"}}>Tap [esc] or click outside to close</span>
    </p>
    </div>
  </Popup>
);

export default About;
