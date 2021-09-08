export function processTask(cb: () => Promise<{ type: string; data: any }>) {
  figma.ui.postMessage({
    type: 'loading',
    data: {},
  });

  setTimeout(async () => {
    try {
      figma.ui.postMessage(await cb());
    } catch (e) {
      figma.ui.postMessage({
        type: 'error',
        data: {
          message: e.message,
        },
      });
    }
  }, 250);
}
