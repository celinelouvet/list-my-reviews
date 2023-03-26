<script lang="ts">
  import { SvelteUIProvider } from "@svelteuidev/core";

  import Home from "./components/Home.svelte";

  export let token: string;
  export let organization: string;
  export let username: string;
  export let team: string;

  let isDark = false;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDark = true;
  }
</script>

<SvelteUIProvider themeObserver={isDark ? "dark" : "light"}>
  <Home {token} {organization} {username} {team} />
</SvelteUIProvider>
