export function LAU(country, feature) {
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
    case 'DE':
      LAU_ID = feature.NUTS_ID;
      LAU_NAME = feature.NAME_LATN;
      break;
    case 'GR':
      LAU_ID = feature.NUTS_ID;
      LAU_NAME = feature.NAME_LATN;
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
