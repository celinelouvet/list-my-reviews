import { request } from "@octokit/request";
import { parseUsers, type User } from "../../schemas";

const defaultMaxPerPage = 100;

type Options = {
  token: string;
  organization: string;
  team: string;
};

const fetchGithub = async ({ token, organization, team }: Options) => {
  const options = {
    headers: { authorization: `token ${token}` },
    org: organization,
    team_slug: team,
    per_page: defaultMaxPerPage,
  };

  const { data: members } = await request(
    `GET /orgs/{org}/teams/{team_slug}/members`,
    options
  );

  return parseUsers(members);
};

const fetchTeamMembers = async (options: Options): Promise<User[]> => {
  const { organization, team } = options;
  const members = await fetchGithub(options);

  console.log(
    `Found ${members.length} members for org ${organization} / team ${team}`
  );

  return members;
};

export default fetchTeamMembers;
