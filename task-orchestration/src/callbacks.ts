import * as fs from "fs";
import * as path from "path";
import { csvLineParse } from "./csv";
import { Config, configNames, home, parseConfig } from "./globals";

main();

function main() {
  resolveConf(configNames, conf => {
    parseCsv(path.join(home, conf.input), data => {
      fs.writeFile(conf.output.callbacks, encode(data), error => {
        console.error(error);
      });
    });
  });
}

function encode(data: string[][]): string {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

function parseCsv(filename: string, done: (data: string[][]) => any) {
  fs.readFile(filename, { encoding: "utf8" }, (error, contents) => {
    if (error) {
      panic(error);
    }

    let lines = contents.split("\n");
    let rows: string[][] = [];
    for (let line of lines) {
      rows.push(csvLineParse(line));
    }

    done(rows);
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
