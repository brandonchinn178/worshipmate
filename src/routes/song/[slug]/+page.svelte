<script lang="ts">
  import { resolve } from "$app/paths"

  let { data } = $props()
  const { song } = $derived(data)
  $effect(() => console.log(song.sheet))
</script>

<p><a href={resolve("/")}>Back to song list</a></p>
<pre>
<!-- TODO -->
{JSON.stringify(song, null, 2)}
</pre>
