<script lang="ts">
  import { AppShell, Header, Modal } from "@svelteuidev/core";
  import { onMount } from "svelte";

  import { getSettings } from "../technical";
  import Content from "./Content.svelte";
  import HeaderContent from "./Header.svelte";
  import SettingsContent from "./Settings.svelte";

  let contentContainer;

  let opened = false;

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
    } else {
      settings = getSettings();
      contentContainer.refresh(settings);
    }
  };

  const closeSettings = () => {
    opened = false;
    settings = getSettings();
    contentContainer.refresh(settings);
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
    <Content bind:container={contentContainer} />
  </slot>
</AppShell>
<Modal {opened} on:close={closeSettings} title="Settings">
  <SettingsContent />
</Modal>
