export function LAU(country, feature) {
  // returns LAU value from GeoJSON Feature to match with data
  switch(country) {
    case 'NZ':
      return feature.lau;
    default:
      return feature.LAU_ID;
  }
}

export function getLauIdName(country, feature) {
  let LAU_ID = null;
  let LAU_NAME = null;
  switch(country) {
    case 'NZ':
      LAU_ID = feature.lau;
      LAU_NAME = feature.launame;
      break;
    default:
      LAU_ID = feature.LAU_ID;
      LAU_NAME = feature.LAU_NAME;
  }
  return { LAU_ID, LAU_NAME };
}


