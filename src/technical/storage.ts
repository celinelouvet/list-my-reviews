import { defaultSettings, parseSettings, type Settings } from "../schemas";

const KEY = "settings";

export const getSettings = () => {
  try {
    const settings = localStorage.getItem(KEY);
    if (settings === null) {
      setSettings(defaultSettings);
      return defaultSettings;
    }
    return parseSettings(JSON.parse(settings));
  } catch (error) {
    setSettings(defaultSettings);
    return defaultSettings;
  }
};

export const setSettings = (settings: Settings) =>
  localStorage.setItem(KEY, JSON.stringify(settings));
