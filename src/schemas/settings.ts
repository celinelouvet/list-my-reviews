import { z } from "zod";

export const SettingsSchema = z.strictObject({
  token: z.string().default(""),
  username: z.string().default(""),
  organization: z.string().default(""),
  team: z.string().default(""),
  withRenovate: z.boolean().default(true),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const defaultSettings: Settings = SettingsSchema.parse({});

export const parseSettings = (setttings: unknown): Settings =>
  SettingsSchema.parse(setttings);
