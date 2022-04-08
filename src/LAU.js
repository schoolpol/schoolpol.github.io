export function LAU(country, feature) {
  // returns LAU value from GeoJSON Feature to match with data
  switch(country) {
    case 'CA':
      return feature.CCSUID;
    case 'NZ':
      return feature.lau;
    case 'US':
      return feature.GEOID;
    default:
      return feature.LAU_ID;
  }
}

export function getLauIdName(country, feature) {
  let LAU_ID = null;
  let LAU_NAME = null;
  switch(country) {
    case 'CA':
      LAU_ID = feature.CCSUID;
      LAU_NAME = feature.CCSNAME;
      break;
    case 'NZ':
      LAU_ID = feature.lau;
      LAU_NAME = feature.launame;
      break;
    case 'US':
      LAU_ID = feature.GEOID;
      LAU_NAME = feature.NAME;
      break;
    default:
      LAU_ID = feature.LAU_ID;
      LAU_NAME = feature.LAU_NAME;
  }
  return { LAU_ID, LAU_NAME };
}


