import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function createZip(files, name) {
  const zip = new JSZip();

  for (let path in files) {
    if (false === files.hasOwnProperty(path)) {
      continue;
    }

    const file = files[path];

    zip.file(path, file.trim() + '\n', { binary: false });
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });

  saveAs(zipContent, `${name}.zip`);
}
