<script lang="ts">
  import { AppShell, Header } from "@svelteuidev/core";

  import Content from "./Content.svelte";
  import HeaderContent from "./Header.svelte";

  export let token: string;
  export let organization: string;
  export let username: string;
  export let team: string;

  let opened = false;
</script>

<AppShell>
  <Header slot="header" height={80}>
    <HeaderContent on:open={() => (opened = true)} />
  </Header>

  <slot>
    <Content {token} {organization} {username} {team} />
  </slot>
</AppShell>
