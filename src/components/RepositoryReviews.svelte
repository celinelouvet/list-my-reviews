<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Badge, Button, Grid, Text } from "@svelteuidev/core";

  import type { PullRequest } from "../schemas";
  import Collapsible from "./Collapsible.svelte";

  export let repository: string;
  export let pullRequests: PullRequest[];

  const color = () => {
    if (pullRequests.length > 10) {
      return "red";
    } else if (pullRequests.length > 5) {
      return "yellow";
    } else {
      return "blue";
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
        <Badge color={color()}>{pullRequests.length}</Badge>
      </Grid.Col>
    </Grid>
  </div>

  <div slot="content">
    <Grid cols={16} align="center">
      <Grid.Col span={3}>
        <Text size="xs" weight="bold">Requester</Text>
      </Grid.Col>
      <Grid.Col span={8}>
        <Text size="xs" weight="bold">Title</Text>
      </Grid.Col>
      <Grid.Col span={3}
        ><Text size="xs" weight="bold">My review</Text></Grid.Col
      >
      <Grid.Col span={2} />
    </Grid>

    {#each pullRequests as pullRequest}
      <Grid cols={16} align="center">
        <Grid.Col span={3}>
          <Text size="xs">{pullRequest.user}</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Text size="xs">{pullRequest.title} (#{pullRequest.number})</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Text size="xs">{pullRequest.myReview}</Text>
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
