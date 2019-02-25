import * as fs from "fs";
import * as path from "path";
import { performance } from "perf_hooks";
import {
  configNames,
  parseConfig,
  home,
  Config,
  parseCsv,
  encode,
} from "./globals";

main();

function main() {
  let start = performance.now();

  resolveConfig(configNames)
    .then(conf =>
      readAndParseCsvToB64(path.join(home, conf.input)).then(b64 =>
        writeOutputFile({ contents: b64, conf })
      )
    )
    .then(console.log)
    .catch(console.error)
    .then(() => {
      console.log("Promises:", performance.now() - start);
    });
}

function resolveConfig(names: string[]): Promise<Config> {
  let readPromise = readFile(names[0]);
  for (let name of names.slice(1)) {
    readPromise = readPromise.catch(() => readFile(name));
  }
  return readPromise.then(parseConfig);
}

function readAndParseCsvToB64(filename: string) {
  return readFile(filename)
    .then(parseCsv)
    .then(encode);
}

interface WriteOutputParams {
  contents: string;
  conf: Config;
}

function writeOutputFile({ conf, contents }: WriteOutputParams) {
  let pathname = path.join(home, conf.output.promises);
  let dirname = path.dirname(pathname);
  let writeContents = () => writeFile(pathname, contents);

  return exists(dirname).then(exists => {
    if (exists) {
      return writeContents();
    }
    return mkdirp(dirname).then(writeContents);
  });
}

function writeFile(filename: string, contents: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, contents, { encoding: "utf8" }, error => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
}

function readFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, { encoding: "utf8" }, (error, contents) => {
      if (error) {
        return reject(error);
      }

      resolve(contents);
    });
  });
}

function exists(pathname: string): Promise<boolean> {
  return stat(pathname)
    .then(() => true)
    .catch(() => false);
}

function stat(pathname: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(pathname, (error, stats) => {
      if (error) {
        return reject(error);
      }

      resolve(stats);
    });
  });
}

function mkdir(dirname: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirname, error => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
}

function mkdirp(dirname: string): Promise<void> {
  return mkdir(dirname).catch(error => {
    if (error.code !== "ENOENT") {
      return Promise.reject(error);
    }

    return mkdirp(path.dirname(dirname)).then(() => mkdir(dirname));
  });
}
