<script lang="ts">
  import { SvelteUIProvider } from "@svelteuidev/core";

  import Home from "./components/Home.svelte";

  let isDark = false;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDark = true;
  }
</script>

<SvelteUIProvider themeObserver={isDark ? "dark" : "light"}>
  <Home />
</SvelteUIProvider>
