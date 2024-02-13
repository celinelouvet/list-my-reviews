<script lang="ts">
  import { Badge, Container, Grid, Space, Text } from "@svelteuidev/core";

  import {
    listAllOpenedPullRequests,
    listMyAssignedReviews,
    listMyPullRequests,
    listOtherReviews,
  } from "../business";
  import type { PullRequest, Repository, Settings } from "../schemas";
  import { fetchAllRepositories } from "../technical";
  import MyPullRequestsContainer from "./MyPullRequests.svelte";
  import ReviewsContainer from "./Reviews.svelte";

  let settings: Settings;
  let organization: string;
  let team: string;
  let username: string;
  let token: string;

  let withApprovedPullRequests: boolean;
  let withRenovate: boolean;

  let myPullRequestsContainer: MyPullRequestsContainer;
  let myReviewsContainer: ReviewsContainer;
  let otherReviewsContainer: ReviewsContainer;

  let repositories: Repository[] = [];
  let myPullRequests: PullRequest[] = [];
  let myReviews: PullRequest[] = [];
  let otherReviews: PullRequest[] = [];

  export const refresh = async (newSettings: Settings) => {
    settings = newSettings;
    organization = settings.organization;
    team = settings.team;
    username = settings.username;
    token = settings.token;
    withApprovedPullRequests = settings.withApprovedPullRequests;
    withRenovate = settings.withRenovate;

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
    myReviews = await listMyAssignedReviews(allOpenedPullRequests, {
      username,
      team,
    });
    otherReviews = await listOtherReviews(allOpenedPullRequests, {
      username,
      team,
    });

    await myPullRequestsContainer.load(myPullRequests);
    await myReviewsContainer.load(settings, myReviews);
    await otherReviewsContainer.load(settings, otherReviews);
  };

  const color = (value: boolean) => (value ? "green" : "blue");
</script>

<main>
  <Container
    override={{
      marginBottom: "2em",
    }}
  >
    <Grid cols={10} align="center">
      <Grid.Col span={4}>
        <Text size="xs">With Renovate pull requests:</Text>
      </Grid.Col>
      <Grid.Col span={1} align="center">
        <Badge color={color(withRenovate)}>{withRenovate ? "Yes" : "No"}</Badge>
      </Grid.Col>

      <Grid.Col span={4}>
        <Text size="xs" align="right">Fetched repositories:</Text>
      </Grid.Col>
      <Grid.Col span={1} align="center">
        <Text size="xs">{repositories.length}</Text>
      </Grid.Col>

      <Grid.Col span={4}>
        <Text size="xs">With approved pull requests:</Text>
      </Grid.Col>
      <Grid.Col span={1} align="center">
        <Badge color={color(withApprovedPullRequests)}
          >{withApprovedPullRequests ? "Yes" : "No"}</Badge
        >
      </Grid.Col>
    </Grid>
  </Container>

  <MyPullRequestsContainer bind:this={myPullRequestsContainer} />
  <Space h="xl" />
  <Space h="xl" />
  <ReviewsContainer
    bind:this={myReviewsContainer}
    title="Pull requests assigned to me"
  />
  <Space h="xl" />
  <Space h="xl" />
  <ReviewsContainer
    bind:this={otherReviewsContainer}
    title="Pull requests assigned to my team"
  />
</main>
