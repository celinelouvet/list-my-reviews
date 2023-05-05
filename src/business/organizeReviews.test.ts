import { ReviewState } from "../schemas";
import {
  RENOVATE,
  withOrWithoutApprovedPullRequest,
  withOrWithoutRenovatePullRequest,
} from "./organizeReviews";

describe("withOrWithoutRenovatePullRequest", () => {
  type TestType = {
    user: string;
    withRenovate: boolean;
    expectedResult: boolean;
  };

  const tests: TestType[] = [
    { user: "whatever", withRenovate: true, expectedResult: true },
    { user: RENOVATE, withRenovate: true, expectedResult: true },
    { user: "whatever", withRenovate: false, expectedResult: true },
    { user: RENOVATE, withRenovate: false, expectedResult: false },
  ];

  it.each(tests)(
    "should return $expectedResult if withRenovate is $withRenovate and user is $user",
    ({ user, withRenovate, expectedResult }: TestType) => {
      const result = withOrWithoutRenovatePullRequest(user, withRenovate);

      expect(result).toEqual(expectedResult);
    }
  );
});

describe("withOrWithoutApprovedPullRequest", () => {
  type TestType = {
    myReview: ReviewState;
    withApprovedPullRequests: boolean;
    expectedResult: boolean;
  };

  const tests: TestType[] = [
    {
      myReview: ReviewState.pending,
      withApprovedPullRequests: true,
      expectedResult: true,
    },
    {
      myReview: ReviewState.approved,
      withApprovedPullRequests: true,
      expectedResult: true,
    },
    {
      myReview: ReviewState.approved,
      withApprovedPullRequests: false,
      expectedResult: false,
    },
    {
      myReview: ReviewState.pending,
      withApprovedPullRequests: false,
      expectedResult: true,
    },
  ];

  it.each(tests)(
    "should return $expectedResult if withApprovedPullRequests is $withApprovedPullRequests and myReview is $myReview",
    ({ myReview, withApprovedPullRequests, expectedResult }: TestType) => {
      const result = withOrWithoutApprovedPullRequest(
        myReview,
        withApprovedPullRequests
      );

      expect(result).toEqual(expectedResult);
    }
  );
});
