import fs from 'fs-extra';
import path from 'path';

export async function getDirectories(source: string, recursive: boolean = false) {
  let files = await fs.readdir(source, { withFileTypes: true });

  let directories = files.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  if (recursive) {
    for (let i = 0; i < directories.length; i++) {
      let directory = directories[i];
      let subDirectories = await getDirectories(path.join(source, directory), true);

      subDirectories.forEach((val) => {
        directories.push(path.join(directory, val));
      });
    }
  }

  return directories;
}
