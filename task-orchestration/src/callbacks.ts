import * as fs from "fs";
import * as path from "path";
import {
  Config,
  configNames,
  home,
  parseConfig,
  encode,
  parseCsv,
} from "./globals";

main();

function main() {
  resolveConf(configNames, conf => {
    readAndParseCsv(path.join(home, conf.input), data => {
      fs.writeFile(conf.output.callbacks, encode(data), error => {
        console.error(error);
      });
    });
  });
}

function readAndParseCsv(filename: string, done: (data: string[][]) => any) {
  fs.readFile(filename, { encoding: "utf8" }, (error, contents) => {
    if (error) {
      panic(error);
    }

    done(parseCsv(contents));
  });
}

function resolveConf(configNames: string[], done: (conf: Config) => any) {
  let i = 0;

  function retryConf(
    internalDone: (error: NodeJS.ErrnoException, conf: Config) => any
  ) {
    let filename = configNames[i++];
    getConfig(filename, (error, conf) => {
      if (error) {
        if (i === configNames.length) {
          //! Lies
          return internalDone(error, null as any);
        }
        retryConf(internalDone);
        return;
      }
      //! Lies
      internalDone(null as any, conf);
    });
  }

  retryConf((error, conf) => {
    if (error) {
      panic(error);
      return;
    }
    done(conf);
  });
}

function getConfig(
  path: string,
  done: (error: NodeJS.ErrnoException, conf: Config) => any
) {
  fs.readFile(path, { encoding: "utf8" }, (error, contents) => {
    if (error) {
      //! Lies
      done(error, null as any);
      return;
    }

    //! Lies
    done(null as any, parseConfig(contents));
  });
}

function panic(...args: any[]): never {
  console.error(...args);
  return process.exit(1);
}
