<script lang="ts">
  import { Container, Loader, Title } from "@svelteuidev/core";
  import { organizeReviews } from "../business";
  import type { PullRequest } from "../schemas";
  import RepositoryMyPullRequests from "./RepositoryMyPullRequests.svelte";

  $: loading = true;

  let pullRequestsToReview: [string, PullRequest[]][] = [];
  let title = "My opened pull requests";

  export const load = async (myPullRequests: PullRequest[]) => {
    loading = true;
    pullRequestsToReview = organizeReviews(myPullRequests, true, true);

    title = `My opened pull requests (${myPullRequests.length})`;
    loading = false;
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
    {#each pullRequestsToReview as [repository, pullRequests]}
      <RepositoryMyPullRequests {repository} {pullRequests} />
    {/each}
  {/if}
</Container>

<style scoped>
  .section-title {
    margin-bottom: 0.75em;
  }
</style>
