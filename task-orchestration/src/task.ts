import * as fs from "fs";
import * as path from "path";
import { Task } from "safe-types";
import { csvLineParse } from "./csv";
import { configNames, parseConfig, home, Config } from "./globals";

main();

function main() {
  let resolveConf = readFile(configNames[0]);
  for (let filename of configNames.slice(1)) {
    resolveConf = resolveConf.or(readFile(filename));
  }

  resolveConf
    .map(parseConfig)
    .and_then(conf =>
      readAndParseCsvToB64(path.join(home, conf.input)).and_then(b64 =>
        writeOutputFile({ contents: b64, conf })
      )
    )
    .fork({
      Ok: console.log,
      Err: console.error,
    });
}

function readAndParseCsvToB64(filename: string) {
  return readFile(filename)
    .map(parseCsv)
    .map(encode);
}

interface WriteOutputParams {
  contents: string;
  conf: Config;
}

function writeOutputFile({ conf, contents }: WriteOutputParams) {
  let pathname = path.join(home, conf.output.tasks);
  let dirname = path.dirname(pathname);
  let writeContents = writeFile(pathname, contents);
  return exists(dirname).and_then(exists => {
    if (exists) {
      return writeContents;
    }
    return mkdirp(dirname).and(writeContents);
  });
}

function encode(data: string[][]): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
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

function writeFile(
  filename: string,
  contents: string
): Task<void, NodeJS.ErrnoException> {
  return new Task(({ Ok, Err }) => {
    fs.writeFile(filename, contents, { encoding: "utf8" }, error => {
      if (error) {
        return Err(error);
      }
      Ok();
    });
  });
}

function exists(pathname: string): Task<boolean, NodeJS.ErrnoException> {
  return stat(pathname)
    .and(Task.of_ok(true))
    .or(Task.of_ok(false));
}

function stat(dir: string): Task<fs.Stats, NodeJS.ErrnoException> {
  return new Task(({ Ok, Err }) => {
    fs.stat(dir, (error, stats) => {
      if (error) {
        return Err(error);
      }

      Ok(stats);
    });
  });
}

function mkdir(pathname: string): Task<void, NodeJS.ErrnoException> {
  return new Task(({ Ok, Err }) => {
    fs.mkdir(pathname, error => {
      if (error) {
        return Err(error);
      }
      Ok();
    });
  });
}

function mkdirp(nestedPath: string): Task<void, NodeJS.ErrnoException> {
  return mkdir(nestedPath).or_else(error => {
    if (error.code !== "ENOENT") {
      return Task.of_err(error);
    }

    return mkdirp(path.dirname(nestedPath)).and(mkdir(nestedPath));
  });
}
