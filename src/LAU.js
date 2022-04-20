export function LAU(country, feature) {
  // returns LAU value from GeoJSON Feature to match with data
  switch(country) {
    case 'AU':
      return feature.SA2_MAIN16;
    case 'CA':
      return feature.CCSUID;
    case 'IE':
      return feature.launame;
    case 'NZ':
      return feature.lau;
    case 'PT':
      return feature.CCA_2;
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
    case 'AU':
      LAU_ID = feature.SA2_MAIN16;
      LAU_NAME = feature.SA2_NAME16;
      break;
    case 'CA':
      LAU_ID = feature.CCSUID;
      LAU_NAME = feature.CCSNAME;
      break;
    case 'IE':
      LAU_ID = feature.launame;
      LAU_NAME = feature.launame;
      break;
    case 'NZ':
      LAU_ID = feature.lau;
      LAU_NAME = feature.launame;
      break;
    case 'PT':
      LAU_ID = feature.CCA_2;
      LAU_NAME = feature.NAME_2;
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


