import json
from pathlib import Path

LAU = {
    "AU": {
        "id": "SA2_MAIN16",
        "name": "SA2_NAME16",
    },
    "CA": {
        "id": "CCSUID",
        "name": "CCSNAME",
    },
    "DE": {
        "id": "NUTS_ID",
        "name": "NAME_LATN",
    },
    "GR": {
        "id": "NUTS_ID",
        "name": "NAME_LATN",
    },
    "IE": {"id": "launame", "name": "launame"},
    "NZ": {
        "id": "lau",
        "name": "launame",
    },
    "PT": {
        "id": "CCA_2",
        "name": "NAME_2",
    },
    "US": {
        "id": "GEOID",
        "name": "NAME",
    },
}

default = {
    "id": "LAU_ID",
    "name": "LAU_NAME",
}

missing = []


def ids(laus: set) -> set:
    return set(x[0] for x in laus)


def lookup(laus: set, id: str) -> (str, str):
    matches = [l for l in laus if l[0] == id]
    if len(matches) == 1:
        return matches[0]
    else:
        return (id, "")


def lau_ids(geojson: Path) -> set:
    country = geojson.stem
    with geojson.open() as fp:
        data = json.load(fp)
        return [
            (
                x["properties"].get(LAU.get(country, default)["id"]),
                x["properties"].get(LAU.get(country, default)["name"]),
            )
            for x in data["features"]
        ]


done = set()
for country in Path("src/data").iterdir():
    if not (country_geojson := country / f"{country.stem}.geojson").exists():
        print("skipping", country)
        continue
    laus = set(lau_ids(country_geojson))
    for file in country.glob("*/ed_isced_?to?.json"):
        year = file.parent.stem
        if (country, year) in done:
            continue
        with file.open() as fp:
            laus_json = set(json.load(fp)["data"].keys())
            for lau in ids(laus) - laus_json:
                missing.append(("missing-data", year, country.stem, *lookup(laus, lau)))
            for lau in laus_json - ids(laus):
                missing.append(
                    ("not-in-geojson", year, country.stem, *lookup(laus, lau))
                )
            done.add((country, year))

header = ["report_type", "year", "country", "lau_id", "lau_name"]
print("\t".join(header))
print("\n".join("\t".join(m) for m in missing))
