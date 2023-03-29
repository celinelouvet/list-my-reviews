import type { PullRequest } from "./schemas";

const RENOVATE = "renovate[bot]";

type Entry = [string, PullRequest[]];

const sortByPullRequestNumber = (pullRequests: PullRequest[]) => {
  const sorted = [...pullRequests];
  sorted.sort((a, b) => a.number - b.number);
  return sorted;
};

const sortByRepositoryName = (groupeds: Entry[]): Entry[] => {
  const sorted = [...groupeds];
  sorted.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return sorted.map(([repositoryName, pullRequests]) => [
    repositoryName,
    sortByPullRequestNumber(pullRequests),
  ]);
};

const filterWithRenovate = (
  pullRequests: PullRequest[],
  withRenovate: boolean
): PullRequest[] =>
  withRenovate
    ? pullRequests
    : pullRequests.filter(({ user }) => user !== RENOVATE);

const buildRepositoryName = ({ repository }: PullRequest): string =>
  `${repository.owner} / ${repository.name}`;

const groupByRepository = (
  pullRequests: PullRequest[]
): Map<string, PullRequest[]> => {
  const groupeds = new Map<string, PullRequest[]>();

  for (const pullRequest of pullRequests) {
    const repositoryName = buildRepositoryName(pullRequest);

    const forRepository: PullRequest[] = groupeds.get(repositoryName) ?? [];
    forRepository.push(pullRequest);
    groupeds.set(repositoryName, forRepository);
  }

  return groupeds;
};

const organizeReviews = (
  pullRequests: PullRequest[],
  withRenovate: boolean
): Entry[] => {
  const filteredPullRequests = filterWithRenovate(pullRequests, withRenovate);
  const grouped = groupByRepository(filteredPullRequests);

  console.log("grouped", grouped);

  return sortByRepositoryName([...grouped.entries()]);
};

export default organizeReviews;
