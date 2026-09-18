#!/usr/bin/env python3
"""Regenerate keys.data.ts"""

from __future__ import annotations

import argparse
import dataclasses
import functools
import json
from collections.abc import Iterator
from pathlib import Path
from typing import Literal

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
class KeyGroup:
    # The primary key should be the "natural" one, e.g. the one we should show
    # as the key of a song.
    primary: Key

    enharmonic: Key | None = None

    @property
    def all_keys(self) -> Iterator[Key]:
        yield self.primary
        if self.enharmonic:
            yield self.enharmonic


@dataclasses.dataclass(frozen=True)
class Key:
    label: str
    accidentals: Literal["flats", "sharps"] | None
    hidden: bool = False

    @property
    def is_base(self) -> bool:
        return len(self.label) == 1


KEYS = [
    KeyGroup(
        Key("C", accidentals=None),
        enharmonic=Key("B#", accidentals="sharps", hidden=True),
    ),
    KeyGroup(
        Key("Db", accidentals="flats"),
        enharmonic=Key("C#", accidentals="sharps"),
    ),
    KeyGroup(
        Key("D", accidentals="sharps"),
    ),
    KeyGroup(
        Key("Eb", accidentals="flats"),
        enharmonic=Key("D#", accidentals="sharps"),
    ),
    KeyGroup(
        Key("E", accidentals="sharps"),
        enharmonic=Key("Fb", accidentals="flats", hidden=True),
    ),
    KeyGroup(
        Key("F", accidentals="flats"),
        enharmonic=Key("E#", accidentals="sharps", hidden=True),
    ),
    KeyGroup(
        Key("Gb", accidentals="flats"),
        enharmonic=Key("F#", accidentals="sharps"),
    ),
    KeyGroup(
        Key("G", accidentals="sharps"),
    ),
    KeyGroup(
        Key("Ab", accidentals="flats"),
        enharmonic=Key("G#", accidentals="sharps"),
    ),
    KeyGroup(
        Key("A", accidentals="sharps"),
    ),
    KeyGroup(
        Key("Bb", accidentals="flats"),
        enharmonic=Key("A#", accidentals="sharps"),
    ),
    KeyGroup(
        Key("B", accidentals="sharps"),
        enharmonic=Key("Cb", accidentals="flats", hidden=True),
    ),
]


def gen_data() -> str:
    render = functools.partial(json.dumps, indent=2)

    keys = [key.primary.label for key in KEYS]
    base_keys = [key.primary.label for key in KEYS if key.primary.is_base]
    degrees = {
        key.label: i
        for i, key_group in enumerate(KEYS)
        for key in key_group.all_keys
        if not key.hidden
    }
    aliases = {
        key.enharmonic.label: key.primary.label  # keep-multiline
        for key in KEYS
        if key.enharmonic
    }
    accidentals = {
        key.label: key.accidentals  # keep-multiline
        for key_group in KEYS
        for key in key_group.all_keys
    }
    to_flats = {
        # Primary keys are already the flat keys
        key.primary.label: key.primary.label
        for key in KEYS
    }
    to_sharps = {
        key.primary.label: (
            key.enharmonic.label
            if key.enharmonic is not None and not key.enharmonic.hidden
            else key.primary.label
        )
        for key in KEYS
    }

    lines = [
        "/* Generated with `npm run regen-keys-data` */",
        "",
        f"export const KEYS = {render(keys)} as const",
        f"export const BASE_KEYS = {render(base_keys)} as const",
        f"export const KEY_DEGREES = {render(degrees)} as const",
        f"export const KEY_ALIASES = {render(aliases)} as const",
        f"export const ACCIDENTALS = {render(accidentals)} as const",
        f"export const TO_FLATS = {render(to_flats)} as const",
        f"export const TO_SHARPS = {render(to_sharps)} as const",
        "",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    main()
