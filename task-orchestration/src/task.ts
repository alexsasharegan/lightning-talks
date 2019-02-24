import * as fs from "fs";
import * as path from "path";
import { Task } from "safe-types";
import { csvLineParse } from "./csv";
import { configNames, parseConfig, home } from "./globals";

main();

function main() {
  let resolveConf = readFile(configNames[0]);
  for (let filename of configNames.slice(1)) {
    resolveConf = resolveConf.or(readFile(filename));
  }

  let getConfig = resolveConf.map(parseConfig);
  let readAndParseCsv = (filename: string) => readFile(filename).map(parseCsv);

  getConfig
    .and_then(conf => readAndParseCsv(path.join(home, conf.input)))
    .fork({
      Ok: console.log,
      Err: console.error,
    });
}

function parseCsv(contents: string): string[][] {
  let lines = contents.split("\n");
  let rows: string[][] = [];
  for (let line of lines) {
    rows.push(csvLineParse(line));
  }

  return rows;
}

function readFile(filename: string): Task<string, NodeJS.ErrnoException> {
  return new Task(({ Ok, Err }) => {
    fs.readFile(filename, { encoding: "utf8" }, (error, contents) => {
      if (error) {
        return Err(error);
      }

      Ok(contents);
    });
  });
}
