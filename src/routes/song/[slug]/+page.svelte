<script lang="ts">
  import { resolve } from "$app/paths"
  import { getSong } from "$lib/song"

  import type { PageProps } from "./$types"

  let { params }: PageProps = $props()

  const songQuery = $derived(getSong(params.slug))
</script>

<p><a href={resolve("/")}>Back to song list</a></p>
<pre>
<!-- TODO -->
{JSON.stringify(songQuery.data, null, 2)}
</pre>
