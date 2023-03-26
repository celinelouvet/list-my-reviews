import { partition, reverse } from "ramda";
import { fetchAllReviews, fetchOpenedPullRequests } from "./github";
import type { PullRequest, Repository } from "./schemas";

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
  { username, team }: CurrentUser
) => {
  const [requestedReviews, nonRequestedReviews] = partition(
    ({ requestedReviewers, requestedTeams }) =>
      requestedReviewers.includes(username) || requestedTeams.includes(team),
    allPullRequests
  );

  return { mine: requestedReviews, others: nonRequestedReviews };
};

const fetchReviewsAlreadyDone = async (
  allPullRequests: PullRequest[],
  { username }: CurrentUser,
  token: string
): Promise<PullRequest[]> => {
  const allReviews = await Promise.all(
    allPullRequests.map((pullRequest) =>
      fetchAllReviews({ token, pullRequest })
    )
  );
  console.log("username", username);

  const requestedReviews: PullRequest[] = [];

  for (const [index, pullRequest] of allPullRequests.entries()) {
    const reviews = allReviews[index];
    const myReview = reverse(reviews).find(({ login }) => login === username);

    if (myReview) {
      requestedReviews.push({ ...pullRequest, myReview: myReview.state });
    }
  }

  return requestedReviews;
};

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

export const listMyReviews = async (
  allPullRequests: PullRequest[],
  currentUser: CurrentUser,
  { token }: Options
): Promise<PullRequest[]> => {
  const { mine: requestedReviews, others: othersPullRequests } = mineOrMyTeams(
    allPullRequests,
    currentUser
  );

  const pullRequestsAlreadyReviewed = await fetchReviewsAlreadyDone(
    othersPullRequests,
    currentUser,
    token
  );

  const pullRequestsToReview = [
    ...requestedReviews,
    ...pullRequestsAlreadyReviewed,
  ];

  console.log(
    `Found ${pullRequestsToReview.length} / ${allPullRequests.length} pull requests for me`
  );

  return pullRequestsToReview;
};
