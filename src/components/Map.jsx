// highlighting feature derived from Map.js in
// https://github.com/fmuchembi/Kenya-2019-census-web-map (MIT licensed)

import React from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import { getColor, legendValues } from "../palette";
import config from "../config.json";
import centroids from "../centroids.json";
import index from "../dataindex.json";

const url = "https://data.trenozoic.net/schoolpol";
const countries = config.countries;

class Map extends React.Component {

  _mounted = false;

  constructor(props) {
    super(props);
    let initCountry = "AT";
    this.state = {
      country: initCountry,
      variable: index[initCountry].initialState.variable,
      year: index[initCountry].initialState.year,
      position: centroids[initCountry],
      geoJSON: null,
      variableData: null,
      map: null,
      lau: null,
      launame: null,
      value: null,
      gender: "",
      percentage: null,
    };
  }

  componentDidMount() {
    this._mounted = true;
    if (this._mounted) {
      fetch(`${url}/${this.state.country}/${this.state.country}.geojson`)
        .then((res) => res.json())
        .then((json) => this.setState({ geoJSON: json }));
      fetch(
        `${url}/${this.state.country}/${this.state.year}/${this.state.variable}${this.state.gender}.json`
      )
        .then((res) => res.json())
        .then((json) => this.setState({ variableData: json.data }));
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  hover(e) {
    let layer = e.target;
    const { LAU_ID, LAU_NAME } = layer.feature.properties;
    let data = this.state.variableData[LAU_ID];
    this.setState({
      lau: LAU_ID,
      launame: LAU_NAME,
      value: data.v,
      percentage: data["%"],
    });
  }

  style(feature) {
    let percentage =
      this.state.variableData?.[feature.properties.LAU_ID]?.["%"];
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

  changeCountry(e) {
    let country = e.target.value;
    let variable = index[country].variables.includes(this.state.variable)
      ? this.state.variable
      : index[country].initialState.variable;
    let year = index[country].initialState.year;
    fetch(`${url}/${country}/${country}.geojson`)
      .then((res) => res.json())
      .then((geoJSON) => this.setState({ country, variable, year, geoJSON }));
    fetch(`${url}/${country}/${year}/${variable}${this.state.gender}.json`)
      .then((res) => res.json())
      .then((json) => this.setState({ variableData: json.data }));
    this.state.map.flyTo(centroids[country], countries[country].zoom ?? 6);
  }

  changeVariable(e) {
    let variable = e.target.value;
    fetch(
      `${url}/${this.state.country}/${this.state.year}/${variable}${this.state.gender}.json`
    )
      .then((res) => res.json())
      .then((json) =>
        this.setState({ variableData: json.data, variable: variable })
      );
  }

  changeGender(e) {
    let gender = e.target.value;
    fetch(
      `${url}/${this.state.country}/${this.state.year}/${this.state.variable}${gender}.json`
    )
      .then((res) => res.json())
      .then((json) =>
        this.setState({ variableData: json.data, gender: gender })
      );
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
          <select
            name="country"
            id="country"
            onChange={this.changeCountry.bind(this)}
          >
            {Object.keys(countries).map((country) => (
              <option value={country}>{countries[country].name}</option>
            ))}
          </select>
          <select
            name="variables"
            id="variables"
            value={this.state.variable}
            onChange={this.changeVariable.bind(this)}
          >
            <option value="ed_isced_0to2">0 - 2</option>
            <option value="ed_isced_3to5">3 - 5</option>
            <option value="ed_isced_6to8">6 - 8</option>
          </select>
          <select
            name="gender"
            id="gender"
            onChange={this.changeGender.bind(this)}
          >
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
          <div id="legend">
            <ul>
              {legendValues(this.state.variable).map((l) => (
                <li key={`${this.state.variable}${l.text}`} style={{ "--color": l.color }}>{l.text}</li>
              ))}
            </ul>
          </div>

          <MapContainer
            center={this.state.position}
            zoom={7}
            whenCreated={(map) => this.setState({ map })}
          >
            {this.state.geoJSON && (
              <GeoJSON
                key={this.state.country}
                data={this.state.geoJSON}
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
