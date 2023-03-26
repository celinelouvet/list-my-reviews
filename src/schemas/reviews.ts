import { z } from "zod";
import { UserSchema } from "./users";

export enum State {
  approved = "APPROVED",
  commented = "COMMENTED",
  dismissed = "DISMISSED",
  pending = "PENDING",
  changesRequested = "CHANGES_REQUESTED",
}

const ReceivedSchema = z.object({
  user: UserSchema,
  state: z.nativeEnum(State),
});

export const ReviewSchema = ReceivedSchema.transform(({ user, state }) => ({
  login: user.login,
  state,
}));

export type Review = z.infer<typeof ReviewSchema>;

export const parseReviews = (reviews: unknown): Review[] =>
  z.array(ReviewSchema).parse(reviews);
