// highlighting feature derived from Map.js in
// https://github.com/fmuchembi/Kenya-2019-census-web-map (MIT licensed)

import React from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import colorbrewer from "colorbrewer";

// replace with fetch() calls according to current state
import countries from '../countries.json';
import geojson from "../data/UK/UK.json";
import education from "../data/UK/2011/ed_isced_6to8.json";
const position = [54.505, -0.09];

const defaultColor = "#eeeeee"; // gray

const scales = {
  ed_isced_6to8: {
    palette: colorbrewer.OrRd,
    thresholds: [0, 0.5, 1, 2, 5, 10, 15, 20, 30, 100],
  },
  ed_isced_3to5: {
    palette: colorbrewer.BuPu,
    thresholds: [0, 5, 10, 15, 20, 30, 40, 50, 60, 100],
  },
  ed_isced_0to2: {
    palette: colorbrewer.YlGn,
    thresholds: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
};

function getColor(variable, value) {
  if (variable === undefined) return defaultColor;
  let scale = scales[variable];
  let ncolors = scale.thresholds.length - 1;
  let palette = scale.palette[ncolors];
  for (let i = 0; i < scale.thresholds.length; i++) {
    if (value < scale.thresholds[i]) {
      return palette[i - 1];
    }
  }
  return defaultColor;
}

function legendValues(variable) {
  let values = [];
  let scale = scales[variable];
  let palette = scale.palette[scale.thresholds.length - 1];
  for (let i = 0; i < scale.thresholds.length - 1; i++) {
    values.push({
      color: palette[i],
      text: `${scale.thresholds[i]} - ${scale.thresholds[i + 1]}`,
    });
  }
  return values;
}

class Legend extends React.Component {
  render() {
    console.log(legendValues("ed_isced_6to8"));
    return (
      <div id="legend">
        <ul>
          {legendValues("ed_isced_6to8").map((l) => (
            <li style={{ "--color": l.color }}>{l.text}</li>
          ))}
        </ul>
      </div>
    );
  }
}
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "UK",
      variable: "ed_isced_6to8",
      year: 1987,
      geoJSON: null,
      lau: null,
      launame: null,
      value: null,
      percentage: null,
    };
  }

  // componentDidMount () {
  //   fetch(`${url}/${this.state.country}/${this.state.country}.geojson`)
  //   .then(res => res.json())
  //   .then(json => this.setState({ geoJSON: json }));
  // }

  hover(e) {
    let layer = e.target;
    const { LAU_ID, LAU_NAME } = layer.feature.properties;
    let data = education.data[LAU_ID];
    this.setState({
      lau: LAU_ID,
      launame: LAU_NAME,
      value: data.v,
      percentage: data["%"],
    });
  }

  style(feature) {
    let percentage = education.data?.[feature.properties.LAU_ID]?.["%"];
    let base = {
      fillColor: getColor(this.state.variable, percentage),
      weight: 0,
      fillOpacity: 0.8,
    };
    let highlight =
      feature.properties.LAU_ID === this.state.lau
        ? {
            weight: 3,
            color: "black",
          }
        : {};
    return { ...base, ...highlight };
  }

  reset(e) {
    // e.target.setStyle(this.style(e.target.feature));
    this.setState({
      lau: null,
      launame: null,
      value: null,
      percentage: null,
    });
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.hover.bind(this),
      mouseout: this.reset.bind(this),
    });
  }

  render() {
    let hoverMessage = <strong>Hover on a local area to see details</strong>;
    if (this.state.lau !== null)
      hoverMessage = (
        <span>
          <strong>{this.state.launame}</strong> {this.state.value} (
          {Math.round(this.state.percentage)}%)
        </span>
      );
    return (
      <div id="content">
      <div id="chooser">
        <p>Select a country to get started ⟶</p>
        <select name="country" id="country">
        { countries.map((country) => <option value={country.code}>{country.name}</option>) }
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

      <div id="map">
        <div id="lauInfo">{hoverMessage}</div>
        <Legend />
        <MapContainer center={position} zoom={6}>
          {geojson && (
            <GeoJSON
              data={geojson}
              style={this.style.bind(this)}
              onEachFeature={this.onEachFeature.bind(this)}
            />
          )}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      </div>
    );
  }
}

export default Map;
