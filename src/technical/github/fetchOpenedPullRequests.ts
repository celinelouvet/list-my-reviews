import { request } from "@octokit/request";
import {
  parsePullRequests,
  type PullRequest,
  type Repository,
} from "../../schemas";

const defaultMaxPerPage = 100;
const defaultPage = 1;

type Options = {
  token: string;
  allPullRequests?: PullRequest[];
  page?: number;
  max?: number;
  repository: Repository;
};

export enum State {
  open = "open",
  closed = "closed",
  all = "all",
}

const fetchGithub = async ({
  token,
  repository: { owner, name },
  page = defaultPage,
  max = defaultMaxPerPage,
}: Options): Promise<PullRequest[]> => {
  try {
    const options = {
      headers: { authorization: `token ${token}` },
      owner,
      repo: name,
      per_page: max,
      state: State.open,
      base: "master",
      page,
    };

    const { data: pullRequests } = await request(
      "GET /repos/{owner}/{repo}/pulls",
      options
    );

    return parsePullRequests(pullRequests);
  } catch (error) {
    return [];
  }
};

const fetchPullRequestsByPage = async (
  options: Options
): Promise<PullRequest[]> => {
  const {
    allPullRequests: previousPullRequests = [],
    page = defaultPage,
    max = defaultMaxPerPage,
  } = options;

  const pullRequests = await fetchGithub(options);
  const allPullRequests = [...previousPullRequests, ...pullRequests];

  if (pullRequests.length < max) {
    return allPullRequests;
  }

  return await fetchPullRequestsByPage({
    ...options,

    allPullRequests,
    page: page + 1,
  });
};

const fetchOpenedPullRequests = async (
  options: Options
): Promise<PullRequest[]> => fetchPullRequestsByPage(options);

export default fetchOpenedPullRequests;
