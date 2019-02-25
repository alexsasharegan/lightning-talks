import * as fs from "fs";
import * as path from "path";
import { performance } from "perf_hooks";
import { Task } from "safe-types";
import {
  configNames,
  parseConfig,
  home,
  Config,
  parseCsv,
  encode,
} from "./globals";

const app = resolveConfig(configNames).and_then(conf =>
  readAndParseCsvToB64(path.join(home, conf.input)).and_then(b64 =>
    writeOutputFile({ contents: b64, conf })
  )
);

let start = performance.now();
app.run().then(result => {
  result.match({
    Ok: console.log,
    Err: console.error,
  });
  console.log("Tasks:", performance.now() - start);
});

function resolveConfig(names: string[]): Task<Config, NodeJS.ErrnoException> {
  let resolveConf = readFile(names[0]);
  for (let filename of names.slice(1)) {
    resolveConf = resolveConf.or(readFile(filename));
  }

  return resolveConf.map(parseConfig);
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
