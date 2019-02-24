import * as path from "path";

export interface Config {
  input: string;
  output: {
    callbacks: string;
    promises: string;
    tasks: string;
  };
}

export const home = path.join(__dirname, "..");
export const configNames = ["conf.json", "app.config.json", "config.json"].map(
  name => path.join(home, name)
);

export function parseConfig(contents: string): Config {
  return JSON.parse(contents);
}
