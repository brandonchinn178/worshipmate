<script lang="ts">
  import { type Key, renderAbsNote, renderNote } from "$lib/songsheet/key"
  import { map2 } from "$lib/utils/lang"

  import { type VocalRange } from "./model.ts"
  import { type DiagramPart, toDiagram } from "./VocalRangeDiagram.ts"

  const { range, key, height }: { range: VocalRange; key: Key; height?: string } = $props()
  const diagram = $derived(toDiagram(range, { key }))

  const [loStr, hiStr] = $derived(map2(range, (note) => renderAbsNote(note, { key })))

  // Layout constants (SVG units; the SVG scales to its container)
  const BAR_GAP = 1
  const BAR_WIDTH = 8
  const BAR_HEIGHT = 50
  const FONT_SIZE = 14
  const PAD_X = BAR_WIDTH
  const PAD_Y = FONT_SIZE / 2

  type Bar = DiagramPart & { kind: string; key: string }

  // Offsets are measured in semitones from the start note, so the low
  // note at offset 0 sits at the left edge.
  let bars: Bar[] = $derived([
    { ...diagram.start, kind: "highlight", key: "start" },
    ...diagram.roots.map((r, i) => ({ ...r, kind: "root", key: `root-${i.toString()}` })),
    { ...diagram.end, kind: "highlight", key: "end" },
  ])

  const getX = (offset: number) => PAD_X + BAR_WIDTH * BAR_GAP * offset

  let svgWidth = $derived(getX(diagram.end.offset) + BAR_WIDTH + PAD_X)
  const svgHeight = PAD_Y + BAR_HEIGHT + FONT_SIZE + PAD_Y
</script>

<svg
  viewBox="0 0 {svgWidth} {svgHeight}"
  {height}
  role="img"
  aria-label="Vocal range from {loStr} to {hiStr}"
>
  {#each bars as bar (bar.key)}
    <rect
      class="bar {bar.kind}"
      x={getX(bar.offset)}
      y={PAD_Y}
      width={BAR_WIDTH}
      height={BAR_HEIGHT}
      rx="2"
    />
    <text
      x={getX(bar.offset) + BAR_WIDTH / 2}
      y={PAD_Y + BAR_HEIGHT + FONT_SIZE}
      text-anchor="middle"
      font-size={FONT_SIZE}
      fill="currentColor"
    >
      {renderNote(bar.note, { key })}
    </text>
  {/each}
</svg>

<style>
  svg {
    display: block;
  }

  .bar {
    &.highlight {
      fill: var(--secondary);
    }
    &.root {
      fill: var(--light-gray);
    }
  }
</style>
