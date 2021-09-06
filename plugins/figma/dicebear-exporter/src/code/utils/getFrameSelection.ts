export function getFrameSelection() {
  const { selection } = figma.currentPage;

  if (selection.length !== 1 || selection[0].type !== 'FRAME' || selection[0].width !== selection[0].height) {
    throw new Error('Please select a single frame with same width and height.');
  }

  return selection[0];
}
