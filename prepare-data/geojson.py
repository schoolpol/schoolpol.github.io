# Depends: gdal (for ogr2ogr)
import subprocess
from pathlib import Path

import toml

OGR = "ogr2ogr"

with open("src/config.toml") as fp:
    CONFIG = toml.load(fp)
    COUNTRIES = CONFIG["countries"]
    SHAPEFILES = Path(CONFIG["shapefileRoot"])


def output_file(countryCode: str) -> str:
    return Path(f"src/data/{countryCode}/{countryCode}.geojson")


def shp2geojson(countryCode: str, shapefile: Path, EU=False):
    where = ["-where", f"\"CNTR_ID = '{countryCode}'\""] if EU else []
    subprocess.run(
        [
            OGR,
            "-f",
            "GeoJSON",
            *where,
            "-s_srs",
            f"{shapefile}.prj",
            "-t_srs",
            "EPSG:4326",
            output_file(countryCode),
            f"{shapefile}.shp",
        ]
    )


def convert(code: str, overwrite=False):
    if (output := output_file(code)).exists() and not overwrite:
        print(f"{code}: skipping, existing {output}")
        return
    if COUNTRIES[code].get("EU"):
        print(f"{code}: using EU shapefile {CONFIG['EU']}")
        shp2geojson(code, SHAPEFILES / CONFIG["EU"], EU=True)
        return
    if COUNTRIES[code].get("shapefile"):
        print(f"{code}: {COUNTRIES[code]['shapefile']}")
        shp2geojson(code, SHAPEFILES / COUNTRIES[code]["shapefile"])
        return
    print(f"{code}: skipping as non-EU and no shapefile assignment")


if __name__ == "__main__":
    for c in COUNTRIES:
        convert(c)
