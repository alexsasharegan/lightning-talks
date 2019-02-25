import * as path from "path";
import { csvLineParse } from "./csv";

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

export function encode(data: string[][]): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function parseCsv(contents: string): string[][] {
  let lines = contents.split("\n");
  let rows: string[][] = [];
  for (let line of lines) {
    rows.push(csvLineParse(line));
  }

  return rows;
}
