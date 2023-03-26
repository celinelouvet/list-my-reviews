import { z } from "zod";
import { UserSchema } from "./users";

const ReceivedSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  owner: UserSchema,
});

export const RepositorySchema = ReceivedSchema.transform(
  ({ name, full_name, owner }) => ({
    name,
    fullName: full_name,
    owner: owner.login,
  })
);

export type Repository = z.infer<typeof RepositorySchema>;

export const parseRepositories = (repositories: unknown): Repository[] =>
  z.array(RepositorySchema).parse(repositories);
