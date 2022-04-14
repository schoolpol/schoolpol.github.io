# Schoolpol: The Transformation of Post War Education

This repository contains the code and data used to build the Schoolpol online
map that shows education levels by local area units (LAUs) across time for 19
countries across time.

Education levels are standardised following the [International Standard
Classification of Education
(ISCED)](http://uis.unesco.org/sites/default/files/documents/international-standard-classification-of-education-isced-2011-en.pdf)
classification. The map shows education levels corresponding to three levels:
0-2, 3-5 and 6-8, optionally grouped by gender.

## Setup

To setup local development, there are two pathways -- with nix and without. [Nix](https://nixos.org/download.html) is a package manager that supports macOS and Linux (Windows is partially supported via Windows Subsystem for Linux).

### Nix

* **[Install nix](https://nixos.org/download.html)** if not present
  (single-user installation is fine).
* Type `nix-shell` and press <kbd>enter</kbd> or <kbd>return</kbd>. This will create a subshell (like
  Python or conda virtual environment), which will have all the programs
  necessary to build the map.
* Install the Node.js dependencies: `npm ci`

### Without nix

The map uses [Python](https://www.python.org) with the
[poetry](https://python-poetry.org/) package manager and
[Node.js](https://nodejs.org) (use the LTS version).

Use `poetry install` to install the Python dependencies, and `npm ci` to
install the node.js dependencies.

## Generating the data files

The original source data files are in `source-data`:

* **source-data/Data**: contains data files by country, currently only has the 'Human_Capital' folder which has data on educational levels
* **source-data/Shapefiles**: Shapefiles in .shp format; these are converted to GeoJSON by [prepare-data/geojson.py]
