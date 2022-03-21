{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    gdal
    nodePackages.npm
    nodejs
    python3
    python39Packages.pandas
    python39Packages.toml
    python39Packages.pycountry
  ];
}
