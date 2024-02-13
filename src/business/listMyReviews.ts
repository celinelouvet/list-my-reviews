import type { PullRequest, Repository, Review } from "../schemas";
import { fetchAllReviews, fetchOpenedPullRequests } from "../technical";

type Options = {
  token: string;
  repositories: Repository[];
};

export type CurrentUser = {
  username: string;
  team: string;
};

const mineOrMyTeams = (
  allPullRequests: PullRequest[],
  currentUser: CurrentUser
) => {
  const requestedReviews = [];
  const nonRequestedReviews = [];

  for (const pullRequest of allPullRequests) {
    if (isForMeOrMyTeam(pullRequest, currentUser)) {
      requestedReviews.push(pullRequest);
    } else {
      nonRequestedReviews.push(pullRequest);
    }
  }

  return { mine: requestedReviews, others: nonRequestedReviews };
};

const isForMe = (
  { user, requestedReviewers, requestedTeams }: PullRequest,
  { username }: CurrentUser
) => user !== username && requestedReviewers.includes(username);

const isMyTeam = (
  { user, requestedTeams }: PullRequest,
  { username, team }: CurrentUser
) => user !== username && requestedTeams.includes(team);

const isForMeOrMyTeam = (
  { user, requestedReviewers, requestedTeams }: PullRequest,
  { username, team }: CurrentUser
) =>
  user !== username &&
  (requestedReviewers.includes(username) || requestedTeams.includes(team));

export const listAllOpenedPullRequests = async ({
  token,
  repositories,
}: Options): Promise<PullRequest[]> => {
  const pullRequestsByRepository = await Promise.all(
    repositories.map((repository) =>
      fetchOpenedPullRequests({ token, repository })
    )
  );
  return pullRequestsByRepository.flat();
};

export const listMyAssignedReviews = async (
  allPullRequests: PullRequest[],
  currentUser: CurrentUser
) => {
  const notCreatedByMePullRequests = allPullRequests.filter(
    ({ user }) => user !== currentUser.username
  );
  const requestedReviews = notCreatedByMePullRequests.filter((pullRequests) =>
    isForMe(pullRequests, currentUser)
  );

  console.log(
    `Found ${requestedReviews.length} / ${notCreatedByMePullRequests.length} pull requests assigned to me`
  );

  return requestedReviews;
};

export const listOtherReviews = async (
  allPullRequests: PullRequest[],
  currentUser: CurrentUser
) => {
  const notCreatedByMePullRequests = allPullRequests.filter(
    ({ user }) => user !== currentUser.username
  );

  const otherPullRequests = notCreatedByMePullRequests.filter((pullRequest) =>
    isMyTeam(pullRequest, currentUser)
  );

  console.log(
    `Found ${otherPullRequests.length} / ${notCreatedByMePullRequests.length} pull requests for my team`
  );

  return otherPullRequests;
};
