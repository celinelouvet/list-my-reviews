<script lang="ts">
  import { Container, Loader, Title } from "@svelteuidev/core";
  import { listMyPullRequests, organizeReviews } from "../business";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import RepositoryMyPullRequests from "./RepositoryMyPullRequests.svelte";

  $: loading = true;

  let myPullRequests: PullRequest[] = [];
  let pullRequestsToReview: [string, PullRequest[]][] = [];
  let title = "My opened pull requests";

  const load = async (
    settings: Settings,
    repositories: Repository[],
    allOpenedPullRequests: PullRequest[]
  ) => {
    const { username, team, token } = settings;

    loading = true;

    myPullRequests = await listMyPullRequests(
      allOpenedPullRequests,
      { username, team },
      { token, repositories }
    );
    pullRequestsToReview = organizeReviews(myPullRequests, true, true);

    title = `My opened pull requests (${myPullRequests.length})`;
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
        height: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader variant="bars" />
    </Container>
  {:else}
    {#each myPullRequests as pullRequest}
      <RepositoryMyPullRequests {pullRequest} />
    {/each}
  {/if}
</Container>

<style scoped>
  .section-title {
    margin-bottom: 0.75em;
  }
</style>
