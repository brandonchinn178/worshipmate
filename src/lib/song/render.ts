import type { Song } from "$lib/song"
import { renderChord } from "$lib/songsheet/chord"
import type {
  Key,
  SongSheet,
  SongSheetGoto,
  SongSheetLine,
  SongSheetLinePiece,
  SongSheetPart,
  SongSheetPartMeta,
  SongSheetSection,
} from "$lib/songsheet/sheet"

export type RenderOptions = {
  includeHeader: boolean
  includeLabels: boolean
  includeChords: boolean
}

export const DEFAULT_OPTIONS = {
  includeHeader: true,
  includeLabels: true,
  includeChords: true,
}

export class Renderer {
  private readonly options: RenderOptions
  private readonly songKey: Key

  constructor(songKey: Key, options: Partial<RenderOptions> = {}) {
    this.songKey = songKey
    this.options = {
      includeHeader: options.includeHeader ?? DEFAULT_OPTIONS.includeHeader,
      includeLabels: options.includeLabels ?? DEFAULT_OPTIONS.includeLabels,
      includeChords: options.includeChords ?? DEFAULT_OPTIONS.includeChords,
    }
  }

  static renderSong(song: Song, options: Partial<RenderOptions> = {}): string {
    return new Renderer(song.key.root, options).renderSong(song)
  }

  renderSong(song: Song): string {
    const header = this.options.includeHeader
      ? [
          // keep-multiline
          song.title,
          song.artist,
          "",
        ]
      : []
    return [...header, this.renderSheet(song.sheet)].join("\n")
  }

  renderSheet(sheet: SongSheet): string {
    return sheet.parts
      .map((part) => this.renderPart(part))
      .filter((s) => s !== "")
      .join("\n\n")
  }

  renderPart(part: SongSheetPart): string {
    switch (part.type) {
      case "section":
        return this.renderSection(part)
      case "goto":
        return this.renderGoto(part)
    }
  }

  renderPartMeta(meta: SongSheetPartMeta): string {
    return [
      // keep-multiline
      meta.repeat === undefined ? "" : ` (${meta.repeat.toString()}x)`,
    ].join("")
  }

  renderSection(section: SongSheetSection): string {
    const label = this.options.includeLabels
      ? [`[${section.label}${this.renderPartMeta(section.meta)}]`]
      : []
    const lines = section.lines.flatMap((line) => this.renderLine(line))
    return lines.length > 0 ? [...label, ...lines].join("\n") : ""
  }

  renderGoto(goto: SongSheetGoto): string {
    if (!this.options.includeLabels) return ""

    return `[→ ${goto.label}${this.renderPartMeta(goto.meta)}]`
  }

  renderLine(line: SongSheetLine): string[] {
    const pieces = line.pieces.map((piece) => this.renderLinePiece(piece))

    const chords = pieces
      .map(([chord, _]) => chord)
      .join("")
      .trimEnd()
    const lyrics = pieces
      .map(([_, lyrics]) => lyrics)
      .join("")
      .trimEnd()

    return [
      // keep-multiline
      ...(this.options.includeChords ? [chords] : []),
      ...(lyrics !== "" ? [lyrics] : []),
    ]
  }

  renderLinePiece(piece: SongSheetLinePiece): [string, string] {
    const { includeChords } = this.options

    const chord =
      includeChords && "chord" in piece // keep-multiline
        ? renderChord(piece.chord, { base: this.songKey })
        : ""
    const lyrics =
      includeChords && "space" in piece // keep-multiline
        ? "    "
        : "lyrics" in piece
          ? (piece.lyrics ?? "")
          : ""

    const width = Math.max(
      // Make sure there's space after the chord
      includeChords ? chord.length + 1 : 0,
      lyrics.length,
    )

    return [chord.padEnd(width), lyrics.padEnd(width)]
  }
}
