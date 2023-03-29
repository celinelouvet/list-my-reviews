<script lang="ts">
  import { Container, Loader, Text } from "@svelteuidev/core";
  import { onMount } from "svelte";

  import { fetchAllRepositories } from "../github";
  import { listAllOpenedPullRequests, listMyReviews } from "../listMyReviews";
  import organizeReviews from "../organizeReviews";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import RepositoryContainer from "./Repository.svelte";

  export let settings: Settings;

  $: organization = settings.organization;
  $: team = settings.team;
  $: username = settings.username;
  $: token = settings.token;
  $: withRenovate = settings.withRenovate;

  let loading = true;

  let repositories: Repository[] = [];
  let openedPullRequests: PullRequest[] = [];
  let pullRequestsToReview: [string, PullRequest[]][] = [];

  const refresh = async () => {
    loading = true;
    repositories = await fetchAllRepositories({
      token,
      organization,
    });

    const allOpenedPullRequests = await listAllOpenedPullRequests({
      token,
      repositories,
    });

    openedPullRequests = await listMyReviews(
      allOpenedPullRequests,
      { username, team },
      { token, repositories }
    );
    loading = false;

    pullRequestsToReview = organizeReviews(openedPullRequests);
  };

  onMount(() => {
    refresh();
  });
</script>

<main>
  {#if loading}
    <Container
      override={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader variant="bars" />
    </Container>
  {:else}
    <Container
      override={{
        display: "grid",
        gridTemplateColumns: "175px 35px",
        justifyContent: "end",
        marginBottom: "1rem",
      }}
    >
      <Text size="xs">Fetched repositories:</Text>
      <Text size="xs" align="right">{repositories.length}</Text>
      <Text size="xs">Fetched opened pull requests:</Text>
      <Text size="xs" align="right">{openedPullRequests.length}</Text>
    </Container>
    <Container>
      {#each pullRequestsToReview as [repository, pullRequests]}
        <RepositoryContainer {repository} {pullRequests} />
      {/each}
    </Container>
  {/if}
</main>

<style>
</style>
