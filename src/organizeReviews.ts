import { groupBy, sortBy } from "ramda";

import type { PullRequest } from "./schemas";

const sortByRepositoryName = sortBy<[string, PullRequest[]]>(([repository]) =>
  repository.toLowerCase()
);

const filterWithRenovate = (
  pullRequests: PullRequest[],
  withRenovate: boolean
): PullRequest[] =>
  withRenovate
    ? pullRequests
    : pullRequests.filter(({ user }) => user !== "renovate[bot]");

const organizeReviews = (
  pullRequests: PullRequest[],
  withRenovate: boolean
): [string, PullRequest[]][] => {
  const grouped = groupBy(
    ({ repository }) => `${repository.owner} / ${repository.name}`,
    filterWithRenovate(pullRequests, withRenovate)
  ) as Record<string, PullRequest[]>;

  return sortByRepositoryName(Object.entries(grouped));
};

export default organizeReviews;
