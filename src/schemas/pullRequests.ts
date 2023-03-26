import { z } from "zod";
import { State as ReviewState } from "./reviews";
import { UserSchema } from "./users";

export enum State {
  open = "open",
  closed = "closed",
}

const head = z.object({
  repo: z.object({
    name: z.string(),
    owner: UserSchema,
  }),
});
const requestedTeam = z.object({
  slug: z.string(),
});

const ReceivedSchema = z.object({
  url: z.string(),
  html_url: z.string(),
  state: z.nativeEnum(State),
  draft: z.boolean(),
  number: z.number(),
  title: z.string(),
  user: UserSchema,
  requested_reviewers: UserSchema.array(),
  requested_teams: requestedTeam.array(),
  head,
  myReview: z.nativeEnum(ReviewState).optional(),
});

const PullRequestSchema = ReceivedSchema.transform(
  ({
    user,
    html_url,
    requested_reviewers,
    requested_teams,
    head,
    ...rest
  }) => ({
    ...rest,
    user: user.login,
    htmlUrl: html_url,
    requestedReviewers: requested_reviewers.map(({ login }) => login),
    requestedTeams: requested_teams.map(({ slug }) => slug),
    repository: {
      owner: head.repo.owner.login,
      name: head.repo.name,
    },
    myReview: ReviewState.pending,
  })
);

export type PullRequest = z.infer<typeof PullRequestSchema>;

export const parsePullRequests = (pullRequests: unknown): PullRequest[] =>
  z.array(PullRequestSchema).parse(pullRequests);
