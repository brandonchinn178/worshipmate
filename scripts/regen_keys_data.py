#!/usr/bin/env python3
"""Regenerate keys.data.ts"""

import argparse
import dataclasses
import functools
import json
from collections.abc import Sequence
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=ROOT_DIR / "src/lib/songsheet/key.data.ts",
    )
    args = parser.parse_args()

    args.output.write_text(gen_data())


@dataclasses.dataclass(frozen=True)
class Key:
    label: str
    aliases: Sequence[str] = dataclasses.field(default_factory=list)

    @property
    def is_base(self) -> bool:
        return len(self.label) == 1


KEYS = [
    Key("C", aliases=["B#"]),
    Key("Db", aliases=["C#"]),
    Key("D"),
    Key("Eb", aliases=["D#"]),
    Key("E", aliases=["Fb"]),
    Key("F", aliases=["E#"]),
    Key("Gb", aliases=["F#"]),
    Key("G"),
    Key("Ab", aliases=["G#"]),
    Key("A"),
    Key("Bb", aliases=["A#"]),
    Key("B", aliases=["Cb"]),
]


def gen_data() -> str:
    render = functools.partial(json.dumps, indent=2)

    keys = [key.label for key in KEYS]
    base_keys = [key.label for key in KEYS if key.is_base]
    degrees = {key.label: i for i, key in enumerate(KEYS)}
    aliases = {alias: key.label for key in KEYS for alias in key.aliases}

    lines = [
        "/* Generated with `npm run regen-keys-data` */",
        "",
        f"export const KEYS = {render(keys)} as const",
        f"export const BASE_KEYS = {render(base_keys)} as const",
        f"export const KEY_DEGREES = {render(degrees)} as const",
        f"export const KEY_ALIASES = {render(aliases)} as const",
        "",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    main()
