import pytest

import process_data as T

NaN = float("NaN")


_IS_EMPTY = [
    ({"12": {"%": NaN, "v": NaN}}, True),
    ({"12": {"%": 24.0, "v": 54.1}}, False),
]


@pytest.mark.parametrize("source,expected", _IS_EMPTY)
def test_is_empty(source, expected):
    assert T.is_empty(source) == expected
