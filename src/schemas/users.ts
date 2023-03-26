import { z } from "zod";

export const UserSchema = z.object({
  login: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const parseUsers = (users: unknown): User[] =>
  z.array(UserSchema).parse(users);
