import { request } from "@octokit/request";
import { parseReviews, type PullRequest, type Review } from "../../schemas";

const defaultMaxPerPage = 100;
const defaultPage = 1;

type Options = {
  token: string;
  allReviews?: Review[];
  page?: number;
  max?: number;
  pullRequest: PullRequest;
};

const fetchGithub = async ({
  token,
  page = defaultPage,
  max = defaultMaxPerPage,
  pullRequest: { number, repository },
}: Options): Promise<Review[]> => {
  try {
    const options = {
      headers: { authorization: `token ${token}` },
      owner: repository.owner,
      repo: repository.name,
      pull_number: number,
      per_page: max,
      page,
    };

    const { data: reviews } = await request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      options
    );

    return parseReviews(reviews);
  } catch (error) {
    return [];
  }
};

const fetchReviewsByPage = async (options: Options): Promise<Review[]> => {
  const {
    allReviews: previousReviews = [],
    page = defaultPage,
    max = defaultMaxPerPage,
  } = options;

  const reviews = await fetchGithub(options);
  const allReviews = [...previousReviews, ...reviews];

  if (reviews.length < max) {
    return allReviews;
  }

  return await fetchReviewsByPage({
    ...options,

    allReviews,
    page: page + 1,
  });
};

const fetchAllReviews = async (options: Options): Promise<Review[]> =>
  fetchReviewsByPage(options);

export default fetchAllReviews;
