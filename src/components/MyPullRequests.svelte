<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Badge, Button, Grid, Text } from "@svelteuidev/core";

  import type { PullRequest } from "../schemas";
  import Collapsible from "./Collapsible.svelte";

  export let pullRequest: PullRequest;

  const color = () => {
    switch (pullRequest.state) {
      case "closed":
        return "red";
      case "open":
        return "blue";
      case "draft":
        return "gray";
    }
  };
</script>

<Collapsible>
  <div slot="header">
    <Grid cols={16} align="center">
      <Grid.Col span={14}>
        <Text size="lg">{pullRequest.repository.name}</Text>
      </Grid.Col>
      <Grid.Col span={1} align="center">
        <Badge color={color()}>{pullRequest.state}</Badge>
      </Grid.Col>
    </Grid>
  </div>

  <div slot="content">
    <Grid cols={16} align="center">
      <Grid.Col span={14}>
        <Text size="xs">{pullRequest.title}</Text>
      </Grid.Col>

      <Grid.Col span={2}>
        <Button
          href={pullRequest.htmlUrl}
          target="_blank"
          size="xs"
          ripple
          variant="subtle"
        >
          Open
          <Icon icon="ic:outline-open-in-new" slot="rightIcon" />
        </Button>
      </Grid.Col>
    </Grid>
  </div>
</Collapsible>
