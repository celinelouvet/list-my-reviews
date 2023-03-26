import { groupBy, sortBy } from "ramda";

import type { PullRequest } from "./schemas";

const sortByRepositoryName = sortBy<[string, PullRequest[]]>(([repository]) =>
  repository.toLowerCase()
);

const organizeReviews = (
  pullRequests: PullRequest[]
): [string, PullRequest[]][] => {
  const grouped = groupBy(
    ({ repository }) => `${repository.owner} / ${repository.name}`,
    pullRequests
  ) as Record<string, PullRequest[]>;

  return sortByRepositoryName(Object.entries(grouped));
};

export default organizeReviews;
