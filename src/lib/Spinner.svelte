<script lang="ts">
  import ProgressActivityIcon from "@iconify-svelte/material-symbols/progress-activity"

  const props = $props()
</script>

<ProgressActivityIcon class="spinner-icon" role="status" aria-label="Loading..." {...props} />

<style>
  :global(.spinner-icon) {
    animation: animate-spinner 2s linear infinite;
    transform-origin: center;

    color: var(--primary);
  }
  @keyframes animate-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
