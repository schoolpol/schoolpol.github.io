import math
import json
import argparse
import contextlib
import collections
from typing import Any
from pathlib import Path

import pycountry
import pandas as pd


keep_same = lambda x: x  # NOQA
with open("src/config.json") as fp:
    CONFIG = json.load(fp)

# lau_transform_* functions transform the lau code in the data
# into a format that matches the geojson.


def lau_transform_ndigits(lau, ndigits):
    "Generic LAU transformation function with ndigits padding"
    try:
        lau = int(lau)
        return f"{lau:0{ndigits}d}"
    except ValueError:
        return "0" * ndigits


lau_transform = {
    "CA": keep_same,
    "CH": lambda x: f"CH{x:0>4s}",
    "DE": keep_same,
    "GR": keep_same,
    "IE": keep_same,
    "NZ": lambda x: f"0{x}" if len(x) > 1 else f"00{x}",
    "UK": keep_same,
    "US": lambda x: "{0:0>2s}{1:0>3s}".format(*x.split("_"))
}


def safe_int(n):
    with contextlib.suppress(ValueError):
        return int(n)


def lookup_country_code(country: str) -> str:
    "Look up country codes"
    if country.upper() == "UK":
        return "UK"  # Use UK as this is used in the shapefile
    return pycountry.countries.lookup(country).alpha_2


def get_variables_data(file: Path) -> dict[str, Any]:
    """
    Writes out split JSON files of the form cc/cc_year_variable.json
    where cc is the ISO 3166-1 two letter country code
    """
    try:
        year = int(file.stem.split("_")[1])
    except (ValueError, IndexError):
        raise ValueError(f"{file} is not in format country_year.csv")
    country = file.stem.split("_")[0]
    country_code = lookup_country_code(country)

    df = pd.read_csv(file, dtype=str, encoding=CONFIG["source"].get("encoding", "utf-8"))
    variables = set(CONFIG["variables"]) & set(df.columns)
    if not variables:
        print(f"- {file} [ERROR, no valid variable found]")
        return None
    pc_variables = {x + "_pc" for x in variables}
    if not pc_variables < set(df.columns):
        print(f"- {file} [ERROR, percentage variables missing]")
        print(" ", pc_variables - set(df.columns))
        return None

    # some countries use LAU names for mapping
    if country_code == 'IE':
        df['lau'] = df.launame
    if country_code == 'DE':
        df['lau'] = df.NUTS3CODE

    ndigits_lau = max(df.lau.astype(str).apply(len))
    df["lau"] = df.lau.apply(
        lau_transform.get(
            country_code, lambda x: lau_transform_ndigits(x, ndigits_lau)))
    country_code = lookup_country_code(country)

    metadata = {"original_file": file.name, "year": year, "country": country_code}
    data = collections.defaultdict(dict)
    for _, row in df.iterrows():
        for var in CONFIG["variables"]:
            percentage, value = float(row[var + "_pc"]), safe_int(row[var])
            if not math.isnan(percentage):
                data[var][row["lau"]] = {
                    "%": percentage,
                    "v": value,
                }
    return {"metadata": metadata, "data": data}


def is_empty(data: dict[str, Any]) -> bool:
    "Returns whether data has only NaNs"
    for key in data:
        if any(
            bool(val) and isinstance(val, float) and not math.isnan(val)
            for _, val in data[key].items()
        ):
            return False
    return True


def write_variables_data(file: Path):
    if not (data := get_variables_data(file)):
        return None
    folder = (
        Path(CONFIG["source"].get("output", "src/data"))
        / data["metadata"]["country"]
        / str(data["metadata"]["year"])
    )
    if not folder.exists():
        folder.mkdir(parents=True)
    for var in data["data"]:
        output_filename = folder / (var + ".json")
        if not is_empty(data["data"][var]):
            with output_filename.open("w") as fp:
                json.dump(
                    {**data["metadata"], "var": var, "data": data["data"][var]},
                    fp,
                    indent=2,
                )
    print(" ", folder, "✔")


def process(prefix=None):
    prefix = prefix or ""
    source_folder = Path(CONFIG["source"]["location"])
    for file in source_folder.glob(f"*/{prefix}*.csv"):
        write_variables_data(file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare data for Schoolpol web interface")
    parser.add_argument("-p", "--prefix", help="Generate data from source files with this prefix")
    args = parser.parse_args()
    process(args.prefix)
