import P from "parsimmon"

import {
  type Chord,
  type Key,
  KEYS,
  type SongSheet,
  type SongSheetGoto,
  type SongSheetLine,
  type SongSheetLinePiece,
  type SongSheetPart,
  type SongSheetPartMeta,
  type SongSheetSection,
} from "./types"

export const parseSongSheet = (input: string): SongSheet => {
  return p_SongSheet.skip(P.eof).tryParse(input)
}

const p_SongSheet: P.Parser<SongSheet> = P.lazy(() => {
  return p_SongSheetPart
    .sepBy(p_newline.many())
    .map((parts) => ({ parts }))
    .trim(P.optWhitespace)
})

const p_SongSheetPart: P.Parser<SongSheetPart> = P.lazy(() => {
  return P.alt(p_SongSheetSection, p_SongSheetGoto)
})

const p_SongSheetPartMeta: P.Parser<SongSheetPartMeta> = P.lazy(() => {
  const p_meta = <T>(name: string, parser: P.Parser<T>) =>
    P.string("#" + name)
      .then(P.string("="))
      .then(parser)

  return P.alt(
    p_meta(
      "repeat",
      P.digits.map((n) => ({ repeat: parseInt(n, 10) })),
    ),
  )
    .sepBy(P.whitespace)
    .map((metas) => metas.reduce((acc, meta) => ({ ...acc, ...meta }), {} as SongSheetPartMeta))
})

const p_SongSheetSection: P.Parser<SongSheetSection> = P.lazy(() => {
  return P.seqMap(
    p_labelTag("section"),
    p_SongSheetLine.sepBy(p_newline).skip(p_newline),
    P.optWhitespace.then(P.string("{/section}")),
    ({ label, meta }, lines) => ({
      type: "section",
      label,
      meta,
      lines,
    }),
  )
})

const p_SongSheetGoto: P.Parser<SongSheetGoto> = P.lazy(() => {
  return p_labelTag("goto").map(({ label, meta }) => ({ type: "goto", label, meta }))
})

const p_labelTag = (name: string): P.Parser<{ label: string; meta: SongSheetPartMeta }> =>
  P.optWhitespace.then(
    P.string(name)
      .skip(P.whitespace)
      .then(
        P.seqMap(
          // keep-multiline
          p_label,
          P.optWhitespace,
          p_SongSheetPartMeta,
          (label, _, meta) => ({ label, meta }),
        ),
      )
      .wrap(P.string("{"), P.string("}")),
  )

/* ----- Section ----- */

const p_SongSheetLine: P.Parser<SongSheetLine> = P.lazy(() => {
  return P.optWhitespace
    .then(
      P.alt(
        // At least one line piece must exist, or the line must be completely empty
        p_SongSheetLinePiece.atLeast(1),
        P.regexp(/^$/).result([]),
      ),
    )
    .map((pieces) => ({ pieces }))
})

const p_SongSheetLinePiece: P.Parser<SongSheetLinePiece> = P.lazy(() => {
  const p_chordTag = p_Chord.wrap(P.string("["), P.string("]"))
  const p_lyrics = P.regexp(/[^{[\n]+/).desc("lyrics")

  return P.alt(
    P.seqMap(p_chordTag, P.string("_"), (chord) => {
      return { chord, space: true }
    }),
    P.seqMap(
      p_chordTag,
      P.alt(
        p_lyrics,
        // Allow a chord to be at the end of the line
        P.lookahead(p_newline).result(""),
      ),
      (chord, lyrics) => {
        return /^\s*$/.test(lyrics) ? { chord } : { chord, lyrics }
      },
    ),
    P.seqMap(p_lyrics, (lyrics) => {
      return { lyrics }
    }),
  )
})

/* ----- Chord ----- */

const p_Chord: P.Parser<Chord> = P.lazy(() => {
  return P.seqMap(
    p_Key,
    P.regexp(/\w*/),
    P.string("/").then(p_Key).or(P.of(null)),
    (root, ext, bass) => ({
      root,
      ...(ext !== "" ? { ext } : {}),
      ...(bass && { bass }),
    }),
  )
})

const p_Key: P.Parser<Key> = P.lazy(() => {
  // Sort keys longest to shortest, to ensure C# parses before C
  const keys = KEYS.toSorted((a, b) => -(a.length - b.length))
  return P.alt(...keys.map(P.string))
})

/* ----- Utilities ----- */

const p_newline: P.Parser<string> = P.string("\n").desc("newline")

// Space separated words, where each word does not start with #
const p_label: P.Parser<string> = P.regexp(/(?!#)\w+(\s+(?!#)\w+)*/).desc("label")
