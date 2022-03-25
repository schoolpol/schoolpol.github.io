import colorbrewer from "colorbrewer";

import config from "./config.json";
const defaultColor = config.paletteDefaultColor;

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

export function getColor(variable, value) {
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

export function legendValues(variable) {
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
