#!/bin/bash
# Depends: gdal (for ogr2ogr)
set -eou pipefail

echo Generating geojson for Europe
EUROPE_SHAPEFILE=source-data/Shapefiles/Europe/LAU_RG_01M_2018_3035.shp/LAU_RG_01M_2018_3035.shp

for country in IS HR SI LV IT FI FR ES IE DE LU NO EL PT SE \
    EE HU CY RO PL DK AT LT BE SK CZ RS AL BG CH UK NL LI MK MT; do
    echo -n "  $country "
    mkdir -p data/$country
    ogr2ogr -f GeoJSON -where "CNTR_ID = '$country'" data/$country/$country.geojson "$EUROPE_SHAPEFILE"
    echo "✔"
done
