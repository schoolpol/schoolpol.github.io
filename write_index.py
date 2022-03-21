import re
import json
import contextlib
from dataclasses import dataclass
from pathlib import Path


def addsort(xs: list, x) -> list:
    return sorted(set(xs) | {x})


class Index:
    _index = {}
    _created = False

    def __init__(self, source_path):
        if isinstance(source_path, str):
            self.source_path = Path(source_path)
        else:
            self.source_path = source_path

    def _add(self, country: str, year: int, variable: str):
        if not re.match(r"ed_isced_\dto\d$", variable):
            return
        if country not in self._index:
            self._index[country] = {
                "initialState": {"year": None, "variable": None},
                "years": [],
                "variables": [],
            }
        self._index[country]["years"] = addsort(self._index[country]["years"], year)
        self._index[country]["variables"] = addsort(
            self._index[country]["variables"], variable
        )
        self._index[country]["initialState"]["year"] = max(
            self._index[country]["years"]
        )
        self._index[country]["initialState"]["variable"] = min(
            self._index[country]["variables"]
        )

    def add(self, file: Path):
        try:
            country, year, variable = file.relative_to(self.source_path).parts
        except (ValueError, TypeError):
            return
        with contextlib.suppress(AssertionError):
            assert len(country) == 2
            assert len(year) == 4
            assert variable.startswith("ed_isced")
            assert variable.endswith(".json")
        self._add(country, int(year), variable.removesuffix(".json"))

    def __str__(self):
        return json.dumps(self._index, sort_keys=True, indent=2)

    def create(self):
        for f in self.source_path.rglob("*.json"):
            self.add(f)
        self._created = True
        return self

    def write(self, file):
        if not self._created:
            self.create()
        Path(file).write_text(str(self))


Index("src/data").write("src/dataindex.json")
