import { request } from "@octokit/request";

import { parseRepositories, type Repository } from "../../schemas";

const defaultMaxPerPage = 100;
const defaultPage = 1;

type Options = {
  token: string;
  allRepositories?: Repository[];
  page?: number;
  max?: number;
  organization: string;
};

const fetchGithub = async ({
  token,
  page = defaultPage,
  max = defaultMaxPerPage,
  organization,
}: Options) => {
  try {
    const options = {
      headers: { authorization: `token ${token}` },
      org: organization,
      per_page: max,
      page,
    };

    const { data: repositories } = await request(
      `GET /orgs/{org}/repos`,

      options
    );

    return parseRepositories(repositories);
  } catch (error) {
    return [];
  }
};

const fetchRepositoriesByPage = async (
  options: Options
): Promise<Repository[]> => {
  const {
    allRepositories: previousRepositories = [],
    page = defaultPage,
    max = defaultMaxPerPage,
  } = options;

  const repositories = await fetchGithub(options);
  const allRepositories = [...previousRepositories, ...repositories];

  if (repositories.length < max) {
    return allRepositories;
  }

  return await fetchRepositoriesByPage({
    ...options,

    allRepositories,
    page: page + 1,
  });
};

const fetchAllRepositories = async (
  options: Options
): Promise<Repository[]> => {
  const { organization } = options;
  const repositories = await fetchRepositoriesByPage(options);

  console.log(
    `Found ${repositories.length} repositories for org ${organization}`
  );

  return repositories;
};

export default fetchAllRepositories;
