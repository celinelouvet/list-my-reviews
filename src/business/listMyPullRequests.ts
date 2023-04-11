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

const reverseReviews = (reviews: Review[]): Review[] => {
  const reversed: Review[] = [];

  while (reviews.length) {
    reversed.push(reviews.pop());
  }
  return reversed;
};

const latestReviewsStates = (reviews: Review[]): ReviewState[] => {
  const reversed = reverseReviews(reviews);

  const latestReviews = new Map<string, ReviewState>();
  for (const review of reversed) {
    const found = latestReviews.get(review.login);

    if (!found) {
      latestReviews.set(review.login, review.state);
    }
  }

  return [...latestReviews.values()];
};

const getReviewState = (reviews: Review[]): ReviewState => {
  const states = latestReviewsStates(reviews);

  if (states.includes(ReviewState.changesRequested)) {
    return ReviewState.changesRequested;
  }
  if (states.includes(ReviewState.commented)) {
    return ReviewState.commented;
  }
  if (
    !states.includes(ReviewState.pending) &&
    !states.includes(ReviewState.dismissed) &&
    states.includes(ReviewState.approved)
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
      myReview: getReviewState(otherReviews),
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
