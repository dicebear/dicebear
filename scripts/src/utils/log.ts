import fs from 'fs';
import readline from 'readline';

export async function processLineByLine(log: string, cb: (line: string, i: number) => unknown) {
  const fileStream = fs.createReadStream(log);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let i = 0;

  for await (const line of rl) {
    cb(line, i++);
  }
}
