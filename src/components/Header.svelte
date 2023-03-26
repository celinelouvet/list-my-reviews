<script lang="ts">
  import Icon from "@iconify/svelte";
  import { ActionIcon, Grid, Title } from "@svelteuidev/core";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const open = () => dispatch("open");
</script>

<Grid cols={12} grow={true} align="center">
  <Grid.Col span={10}>
    <Title order={1} color="blue">Pull Requests</Title>
  </Grid.Col>
  <Grid.Col span={1}>
    <ActionIcon color="blue" variant="light" on:click={open} size={30}>
      <Icon icon="mdi:cog" />
    </ActionIcon>
  </Grid.Col>
</Grid>
