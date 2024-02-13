<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Badge, Button, Grid, Text } from "@svelteuidev/core";

  import type { PullRequest } from "../schemas";
  import Collapsible from "./Collapsible.svelte";

  export let repository: string;
  export let pullRequests: PullRequest[];

  const countColor = () => {
    if (pullRequests.length > 10) {
      return "red";
    } else if (pullRequests.length > 5) {
      return "yellow";
    } else {
      return "blue";
    }
  };

  const stateColor = (pullRequest: PullRequest) => {
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
        <Text size="lg">{repository}</Text>
      </Grid.Col>
      <Grid.Col span={1} align="center">
        <Badge color={countColor()}>{pullRequests.length}</Badge>
      </Grid.Col>
    </Grid>
  </div>

  <div slot="content">
    {#each pullRequests as pullRequest}
      <Grid cols={16} align="center">
        <Grid.Col span={12}>
          <Text size="xs">{pullRequest.title} (#{pullRequest.number})</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Badge color={stateColor(pullRequest)}>{pullRequest.state}</Badge>
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
    {/each}
  </div>
</Collapsible>
