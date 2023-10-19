import {
  ReviewState,
  type PullRequest,
  type Repository,
  type Review,
} from "../schemas";
import { fetchAllReviews } from "../technical";

type Options = {
  token: string;
  repositories: Repository[];
};

export type CurrentUser = {
  username: string;
  team: string;
};

export const _reverseReviews = (reviews: Review[]): Review[] => {
  const reversed: Review[] = [];

  while (reviews.length) {
    const review = reviews.pop();

    if (review) {
      reversed.push(review);
    }
  }
  return reversed;
};

export const _latestReviewsStates = (reviews: Review[]): ReviewState[] => {
  const reversed = _reverseReviews(reviews);

  const latestReviews = new Map<string, ReviewState>();
  for (const review of reversed) {
    const found = latestReviews.get(review.login);

    if (!found) {
      latestReviews.set(review.login, review.state);
    }
  }

  return [...new Set<ReviewState>(latestReviews.values())];
};

export const _getReviewState = (
  pullRequest: PullRequest,
  reviews: Review[]
): ReviewState => {
  const { requestedReviewers, requestedTeams } = pullRequest;

  const states = _latestReviewsStates(reviews);

  if (states.includes(ReviewState.changesRequested)) {
    return ReviewState.changesRequested;
  }
  if (states.includes(ReviewState.commented)) {
    return ReviewState.commented;
  }
  if (
    !states.includes(ReviewState.pending) &&
    !states.includes(ReviewState.dismissed) &&
    states.includes(ReviewState.approved) &&
    requestedReviewers.length === 0 &&
    requestedTeams.length === 0
  ) {
    return ReviewState.approved;
  }
  return ReviewState.pending;
};

const fetchReviewStates = async (
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
    const otherReviews = reviews.filter(({ login }) => login !== username);

    requestedReviews.push({
      ...pullRequest,
      myReview: _getReviewState(pullRequest, otherReviews),
    });
  }

  return requestedReviews;
};

export const listMyPullRequests = async (
  allPullRequests: PullRequest[],
  currentUser: CurrentUser,
  { token }: Options
): Promise<PullRequest[]> => {
  const { username } = currentUser;
  const mine = allPullRequests.filter(({ user }) => user === username);

  return fetchReviewStates(mine, currentUser, token);
};
