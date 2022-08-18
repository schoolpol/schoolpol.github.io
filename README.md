# Schoolpol: The Transformation of Post War Education

This repository contains the code and data used to build the Schoolpol online
map that shows education levels by local area units (LAUs) across time for 19
countries across time.

Education levels are standardised following the [International Standard
Classification of Education
(ISCED)](http://uis.unesco.org/sites/default/files/documents/international-standard-classification-of-education-isced-2011-en.pdf)
classification. The map shows education levels corresponding to three levels:
0-2, 3-5 and 6-8, optionally grouped by gender.

## Cloning the repository

    git clone git@github.com:schoolpol/schoolpol.github.io.git
      OR
    gh repo clone schoolpol/schoolpol.github.io
    
You will need [git](https://git-scm.com), and either [GitHub Desktop](https://desktop.github.com) or the command-line [gh](https://cli.github.com) installed.

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

On macOS, poetry can be installed by using [brew](https://brew.sh):
`brew install poetry`. You will need to install brew first, if it is not present on your system.

Use `poetry install` to install the Python dependencies, and `npm ci` to
install the node.js dependencies. Use `poetry shell` to enter a subshell where you can run the Python code.


## Generating the data files

The original source data files are in `source-data`. First create the folder in the cloned repository (`mkdir source-data`):

* **source-data/Data**: contains data files by country, currently only has the 'Human_Capital' folder which has data on educational levels
* **source-data/Shapefiles**: Shapefiles in .shp format; these are converted to GeoJSON by [prepare-data/geojson.py](prepare-data/geojson.py)

The source files in **source-data** are used to generate the JSON files in **src/data**:

    python prepare-data/process_data.py  # nix
    poetry run python prepare-data/process_data.py  # poetry


To generate the GeoJSON from ArcGIS shapefiles:

    python prepare-data/geojson.py  # nix
    poetry run python prepare-data/geojson.py  # poetry


Accurate boundary representations can sometimes make the resulting GeoJSON file large. It is **recommended** to keep the GeoJSON file below 10 MiB. You can use the online service https://mapshaper.org for this. This step is not automated and is done on a case-by-case basis.

## Running the application locally

Use `npm start` to run the application locally. The application can be viewed at https://localhost:3000

## Configuration

The main configuration file for the application is at [src/config.json](src/config.json). It contains the following options

* **baseUrl**: URL of Schoolpol main page. This is usually the domain name.
* **shapefileRoot**: Path to the shapefiles folder relative to the project folder.
* **EU**: Location of EU shapefile
* **paletteDefaultColor**: Default color to use when no data is present as RGB hex value.
* **variables**: Data file variables from source-data that should be exported as JSON.
* **source.location**: Path for data files
* **source.encoding**: Encoding in data files

There is a **countries** section that lists the countries to be displayed in the map. This is a dictionary with keys as the ISO two-letter country codes. Each country can have the following keys:

* **name** (required): Name of the country
* **EU**: Whether this should use the EU shapefile (not whether the country is in the EU). GeoJSON for some EU countries are generated from country-specific shapefiles (Portugal, Greece).
* **zoom**: Zoom level to use for the country. Specify higher numbers for smaller countries and lower numbers for larger countries. The default zoom level is 6.
* **shapefile**: Path to shapefile relative to **shapefileRoot**. If specified geojson.py generates data from this shapefile. Do not specify the .shp extension, that is assumed.

## Deployment

Deployment is done on GitHub Pages, with the production build generated using `npm run build`
and stored in the [docs](docs) folder. Once the build is generated, you can preview the
site locally by changing to the docs folder and running a local HTTP server, as an example:

    python3 -m http.server

which will open the site at http://localhost:8000. To make the changes live, commit
the docs folder to version control:

    git commit docs -m 'Update build'
    git push
