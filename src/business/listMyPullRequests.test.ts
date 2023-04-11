import {
  ReviewState,
  type Review,
  type PullRequest,
  PullRequestState,
} from "../schemas";

import {
  _getReviewState,
  _latestReviewsStates,
  _reverseReviews,
} from "./listMyPullRequests";

const login1 = "login1";
const login2 = "login2";
const login3 = "login3";
const team = "team";

const review1: Pick<Review, "login"> = { login: login1 };
const review2: Pick<Review, "login"> = { login: login2 };

const emptyPullRequest: PullRequest = {
  htmlUrl: "htmlUrl",
  user: "user",
  repository: {
    name: "name",
    owner: "owner",
  },
  state: PullRequestState.open,
  myReview: ReviewState.pending,
  requestedReviewers: [],
  requestedTeams: [],
};

describe("_reverseReviews", () => {
  it("should return the reversed array", () => {
    const review1: Review = { login: login1, state: ReviewState.approved };
    const review2: Review = {
      login: login2,
      state: ReviewState.changesRequested,
    };
    const review3: Review = { login: login3, state: ReviewState.commented };

    const reviews = [review1, review2, review3];

    const results = _reverseReviews(reviews);

    expect(results).toEqual([review3, review2, review1]);
  });
});

describe("_latestReviewsStates", () => {
  it("should return the latest review state for each user", () => {
    const review11 = { ...review1, state: ReviewState.changesRequested };
    const review12 = { ...review1, state: ReviewState.approved };
    const review21 = { ...review2, state: ReviewState.commented };
    const review22 = { ...review2, state: ReviewState.changesRequested };

    const reviews = [review11, review12, review21, review22];

    const results = _latestReviewsStates(reviews);

    expect(results).toEqual([
      ReviewState.changesRequested,
      ReviewState.approved,
    ]);
  });
});

type GetReviewStateTestType = {
  reviews: Review[];
  pullRequest: PullRequest;
  expectedState: ReviewState;
};

describe("_getReviewState", () => {
  it.each([
    {
      reviews: [
        { ...review1, state: ReviewState.changesRequested },
        { ...review2, state: ReviewState.commented },
        { ...review2, state: ReviewState.pending },
      ],
      pullRequest: emptyPullRequest,
      expectedState: ReviewState.changesRequested,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.pending },
        { ...review2, state: ReviewState.commented },
      ],
      pullRequest: emptyPullRequest,
      expectedState: ReviewState.commented,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.approved },
        { ...review2, state: ReviewState.approved },
      ],
      pullRequest: emptyPullRequest,
      expectedState: ReviewState.approved,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.approved },
        { ...review2, state: ReviewState.approved },
      ],
      pullRequest: { ...emptyPullRequest, requestedReviewers: [login3] },
      expectedState: ReviewState.pending,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.approved },
        { ...review2, state: ReviewState.approved },
      ],
      pullRequest: { ...emptyPullRequest, requestedTeams: [team] },
      expectedState: ReviewState.pending,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.approved },
        { ...review2, state: ReviewState.pending },
      ],
      pullRequest: emptyPullRequest,
      expectedState: ReviewState.pending,
    },
    {
      reviews: [
        { ...review1, state: ReviewState.approved },
        { ...review2, state: ReviewState.dismissed },
      ],
      pullRequest: emptyPullRequest,
      expectedState: ReviewState.pending,
    },
  ])(
    "should return $expectedState",
    ({ reviews, pullRequest, expectedState }: GetReviewStateTestType) => {
      const results = _getReviewState(pullRequest, reviews);

      expect(results).toEqual(expectedState);
    }
  );
});
