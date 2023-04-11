<script lang="ts">
  import { Container, Space, Text } from "@svelteuidev/core";

  import { listAllOpenedPullRequests, listMyPullRequests } from "../business";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import { fetchAllRepositories } from "../technical";
  import MyPullRequestsContainer from "./MyPullRequests.svelte";
  import ReviewsContainer from "./Reviews.svelte";

  let organization: string;
  let team: string;
  let username: string;
  let token: string;

  let reviewsContainer;
  let myPullRequestsContainer;

  let repositories: Repository[] = [];
  let myPullRequests: PullRequest[] = [];

  const refresh = async (settings: Settings) => {
    organization = settings.organization;
    team = settings.team;
    username = settings.username;
    token = settings.token;

    repositories = await fetchAllRepositories({
      token,
      organization,
    });

    const allOpenedPullRequests = await listAllOpenedPullRequests({
      token,
      repositories,
    });

    myPullRequests = await listMyPullRequests(
      allOpenedPullRequests,
      { username, team },
      { token, repositories }
    );

    await reviewsContainer.load(settings, repositories, allOpenedPullRequests);
    await myPullRequestsContainer.load(
      settings,
      repositories,
      allOpenedPullRequests
    );
  };

  export const container = {
    refresh,
  };
</script>

<main>
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
  </Container>

  <MyPullRequestsContainer bind:container={myPullRequestsContainer} />
  <Space h="xl" />
  <Space h="xl" />
  <ReviewsContainer bind:container={reviewsContainer} />
</main>
