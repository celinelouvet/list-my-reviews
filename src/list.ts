import { fetchAllRepositories } from "./github";
import { listAllOpenedPullRequests, listMyReviews } from "./listMyReviews";
import organizeReviews from "./organizeReviews";

const TOKEN = "";
const MY_LOGIN = "celinelouvet";
const MY_TEAM = "user-success";

const list = async () => {
  const organization = "shinetools";
  try {
    // const members = await fetchTeamMembers({
    //   organization,
    //   team: MY_TEAM,
    //   octokit,
    // });

    // console.log("members", members);

    const repositories = await fetchAllRepositories({
      token: TOKEN,
      organization,
    });
    // const subRepositories = repositories.slice(0, 50);

    const allOpenedPullRequests = await listAllOpenedPullRequests({
      token: TOKEN,
      repositories,
    });

    const myReviews = await listMyReviews(
      allOpenedPullRequests,
      { username: MY_LOGIN, team: MY_TEAM },
      { token: TOKEN, repositories }
    );

    return organizeReviews(myReviews, true);
  } catch (error) {
    console.error("Error: ", error);

    return {};
  }
};

export default list;
