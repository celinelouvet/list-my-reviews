<script lang="ts">
  import Icon from "@iconify/svelte";
  import { clickoutside } from "@svelteuidev/composables";

  let opened = false;

  const toggle = () => (opened = !opened);
</script>

<div
  class="collapsible-container"
  use:clickoutside={{ enabled: opened, callback: () => (opened = false) }}
>
  <div
    on:click={toggle}
    class="header {opened ? 'opened' : 'closed'}"
    aria-hidden="true"
  >
    <Icon
      icon={opened ? "mdi:chevron-down" : "mdi:chevron-right"}
      width="25px"
    />

    <div>
      <slot name="header" />
    </div>
  </div>

  <div class="content {opened ? '' : 'hidden'}">
    <slot name="content" />
  </div>
</div>

<style>
  .collapsible-container {
    border: 1px solid var(--svelteui-colors-gray200);
    color: var(--svelteui-colors-dark600);

    border-radius: var(--svelteui-radii-xs);
  }

  .collapsible-container .header {
    padding: 12px;
    cursor: pointer;

    display: flex;
    align-items: center;
  }
  .collapsible-container .header.opened {
    border-bottom: 1px solid var(--svelteui-colors-gray200);
  }

  .collapsible-container .header *:nth-child(2n) {
    flex: 1;
  }

  .collapsible-container .content {
    padding: 24px 12px 24px 37px;
  }

  .collapsible-container .content.hidden {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    .collapsible-container {
      border: 1px solid var(--svelteui-colors-dark400);
      color: var(--svelteui-colors-dark50);
    }
    .collapsible-container .header.opened {
      border-bottom: 1px solid var(--svelteui-colors-dark400);
    }
  }
</style>
