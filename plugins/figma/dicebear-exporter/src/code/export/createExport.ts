import { prepareExport } from './prepareExport';
import { createExportFiles } from './createExportFiles';

export async function createExport() {
  const exportData = prepareExport();

  return {
    files: await createExportFiles(exportData),
    name: exportData.frame.settings.packageName
      .split('/')
      .slice(-1)[0]
      .replace(/[^a-z0-9\-\_]/gi, ''),
  };
}
