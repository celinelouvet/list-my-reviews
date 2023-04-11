<script lang="ts">
  import { Container, Loader, Title } from "@svelteuidev/core";
  import { listMyReviews, organizeReviews } from "../business";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import RepositoryReviews from "./RepositoryReviews.svelte";

  let loading = true;
  let openedPullRequests: PullRequest[] = [];
  let pullRequestsToReview: [string, PullRequest[]][] = [];
  let title = "Pull requests to review";

  const load = async (
    settings: Settings,
    repositories: Repository[],
    allOpenedPullRequests: PullRequest[]
  ) => {
    const { username, team, token, withRenovate } = settings;

    loading = true;

    openedPullRequests = await listMyReviews(
      allOpenedPullRequests,
      { username, team },
      { token, repositories }
    );
    pullRequestsToReview = organizeReviews(openedPullRequests, withRenovate);

    title = `Pull requests to review (${openedPullRequests.length})`;
    loading = false;
  };

  export const container = {
    load,
  };
</script>

<Container>
  <div class="section-title">
    <Title order={2}>{title}</Title>
  </div>

  {#if loading}
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
