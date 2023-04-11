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

const isForMeOrMyTeam = (
  { user, requestedReviewers, requestedTeams }: PullRequest,
  { username, team }: CurrentUser
) =>
  user !== username &&
  (requestedReviewers.includes(username) || requestedTeams.includes(team));

const reverseReviews = (reviews: Review[]): Review[] => {
  const reversed: Review[] = [];

  while (reviews.length) {
    reversed.push(reviews.pop());
  }
  return reversed;
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

  const requestedReviews: PullRequest[] = [];

  for (const [index, pullRequest] of allPullRequests.entries()) {
    const reviews = allReviews[index];
    const myReview = reverseReviews(reviews).find(
      ({ login }) => login === username
    );

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
