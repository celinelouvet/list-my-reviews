<script lang="ts">
  import { AppShell, Header, Modal } from "@svelteuidev/core";
  import { onMount } from "svelte";
  import { getSettings } from "../storage";

  import Content from "./Content.svelte";
  import HeaderContent from "./Header.svelte";
  import SettingsContent from "./Settings.svelte";

  let opened = false;
  let settingsShown = false;

  let settings = getSettings();

  const hasSettings = () => {
    return (
      settings.token &&
      settings.username &&
      settings.organization &&
      settings.team
    );
  };

  const checkSettings = () => {
    if (!hasSettings()) {
      opened = true;
      settingsShown = false;
    } else {
      settingsShown = true;
    }
  };

  const closeSettings = () => {
    console.log("closeSettings");

    opened = false;
    settings = getSettings();
  };

  onMount(() => {
    checkSettings();
  });
</script>

<AppShell>
  <Header slot="header" height={80}>
    <HeaderContent on:open={() => (opened = true)} />
  </Header>

  <slot>
    {#if settingsShown}
      <Content {settings} />
    {/if}
  </slot>
</AppShell>
<Modal {opened} on:close={closeSettings} title="Settings">
  <SettingsContent />
</Modal>
