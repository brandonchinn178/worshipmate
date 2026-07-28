<script lang="ts">
  import { resolve } from "$app/paths"
  import { page } from "$app/state"

  let { song } = page.data
</script>

<p><a href={resolve("/")}>Back to song list</a></p>
<pre>
<!-- TODO -->
{JSON.stringify(song, null, 2)}
</pre>
