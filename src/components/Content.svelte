<script lang="ts">
  import { Container, Loader, Space, Text } from "@svelteuidev/core";
  import { onMount } from "svelte";

  import {
    listAllOpenedPullRequests,
    listMyReviews,
    organizeReviews,
  } from "../business";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import { fetchAllRepositories } from "../technical";
  import RepositoryContainer from "./Repository.svelte";
  import { listMyPullRequests } from "../business/listMyReviews";
  import MyPullRequestsContainer from "./MyPullRequests.svelte";

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
  let myPullRequests: PullRequest[] = [];

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

    myPullRequests = await listMyPullRequests(allOpenedPullRequests, {
      username,
      team,
    });

    openedPullRequests = await listMyReviews(
      allOpenedPullRequests,
      { username, team },
      { token, repositories }
    );
    loading = false;

    pullRequestsToReview = organizeReviews(openedPullRequests, withRenovate);
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
      <Text size="xs">My pull requests:</Text>
      <Text size="xs" align="right">{myPullRequests.length}</Text>
    </Container>

    <Container>
      <h2>My opened pull requests</h2>

      {#each myPullRequests as pullRequest}
        <MyPullRequestsContainer {pullRequest} />
      {/each}
    </Container>

    <Space h="lg" />
    <Container>
      <h2>Pull requests to review</h2>

      {#each pullRequestsToReview as [repository, pullRequests]}
        <RepositoryContainer {repository} {pullRequests} />
      {/each}
    </Container>
  {/if}
</main>

<style>
</style>
