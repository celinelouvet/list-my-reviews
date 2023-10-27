import { ReviewState, type PullRequest } from "../schemas";

export const RENOVATE = "renovate[bot]";
export const SHINY_BATCH = "shiny-batch-changes[bot]";

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

export const withOrWithoutRenovatePullRequest = (
  user: string,
  withRenovate: boolean
): boolean => withRenovate || (user !== RENOVATE && user !== SHINY_BATCH);

export const withOrWithoutApprovedPullRequest = (
  myReview: ReviewState,
  withApprovedPullRequests: boolean
): boolean => withApprovedPullRequests || myReview !== ReviewState.approved;

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

export const organizeReviews = (
  pullRequests: PullRequest[],
  withRenovate: boolean,
  withApprovedPullRequests: boolean
): Entry[] => {
  const filteredPullRequests = pullRequests
    .filter(({ user }) => withOrWithoutRenovatePullRequest(user, withRenovate))
    .filter(({ myReview }) =>
      withOrWithoutApprovedPullRequest(myReview, withApprovedPullRequests)
    );

  const grouped = groupByRepository(filteredPullRequests);

  console.log("grouped", grouped);

  return sortByRepositoryName([...grouped.entries()]);
};
