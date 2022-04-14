let
  sources = import ./nix/sources.nix;
  pkgs = import sources.nixpkgs {};
in
with pkgs;
pkgs.mkShell {
  buildInputs = with pkgs; [
    gdal
    nodePackages.npm
    nodePackages.prettier
    nodejs
    python3
    python39Packages.pandas
    python39Packages.toml
    python39Packages.pycountry
    python39Packages.pytest
  ];
}
