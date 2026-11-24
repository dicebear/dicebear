/**
 * Saves a blob as a file. The address of the blob stays valid for a minute:
 * Safari on iOS starts the download only after the click has returned, and
 * an address revoked at once makes it fail, most of all with a large file
 * such as the ZIP of a batch.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
