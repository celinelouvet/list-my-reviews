<script lang="ts">
  import { Container, Loader, Title } from "@svelteuidev/core";

  import { organizeReviews } from "../business";
  import type { PullRequest, Settings } from "../schemas";
  import RepositoryReviews from "./RepositoryReviews.svelte";

  export let title: string;
  let loading = true;
  let pullRequestsToReview: [string, PullRequest[]][] = [];

  export const load = async (
    settings: Settings,
    pullRequests: PullRequest[]
  ) => {
    console.log("Reviews container", {
      settings,
      pullRequests: pullRequests.length,
    });
    const { withRenovate, withApprovedPullRequests } = settings;

    loading = true;
    pullRequestsToReview = organizeReviews(
      pullRequests,
      withRenovate,
      withApprovedPullRequests
    );

    loading = false;
  };
</script>

<Container>
  {#if loading}
    <div class="section-title">
      <Title order={2}>{title}</Title>
    </div>

    <Container
      override={{
        height: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader variant="bars" />
    </Container>
  {:else}
    <div class="section-title">
      <Title order={2}>{title} ({pullRequestsToReview.length})</Title>
    </div>
    {#each pullRequestsToReview as [repository, pullRequests]}
      <RepositoryReviews {repository} {pullRequests} />
    {/each}
  {/if}
</Container>

<style scoped>
  .section-title {
    margin-bottom: 0.75em;
  }
</style>
