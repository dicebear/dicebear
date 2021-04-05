import fs from 'fs-extra';
import path from 'path';

export async function list(source: string, { files, directories }: { files?: boolean, directories?: boolean } = {}) {
  let items = await fs.readdir(source, { withFileTypes: true });
  let result: string[] = [];

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (files && item.isFile()) {
      result.push(item.name);
    }

    if (directories && item.isDirectory()) {
      result.push(item.name);
    }

    if (item.isDirectory()) {
      let subItems = await list(path.join(source, item.name), { files, directories });
  
      subItems.forEach((val) => {
        result.push(path.join(item.name, val));
      });
    }
  }

  return result;
}