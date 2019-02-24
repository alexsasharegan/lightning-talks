export function csvLineParse(line: string): string[] {
  let row = [];

  let inside = false;
  let buf = "";
  for (let char of line) {
    switch (char) {
      case `"`:
        inside = !inside;
        break;
      case `,`:
        if (inside) {
          buf += char;
        } else {
          row.push(buf);
          buf = "";
        }
        break;
      default:
        buf += char;
        break;
    }
  }

  row.push(buf);

  return row;
}
