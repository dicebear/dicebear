import { getFrameSelection } from './utils/getFrameSelection';
import { prepareExport } from './export/prepareExport';
import { processTask } from './utils/processTask';
import { setColorGroupSettings } from './settings/setColorGroupSettings';
import { setComponentGroupSettings } from './settings/setComponentGroupSettings';
import { setFrameSettings } from './settings/setFrameSettings';
import { createExport } from './export/createExport';

figma.showUI(__html__, { width: 720, height: 400 });

figma.on('selectionchange', () =>
  processTask(async () => ({
    type: 'loaded',
    data: prepareExport(),
  }))
);

figma.ui.onmessage = async (msg) => {
  const typeSplit = msg.type.split(':');

  switch (typeSplit[0]) {
    case 'init':
      processTask(async () => ({
        type: 'loaded',
        data: prepareExport(),
      }));
      break;

    case 'set':
      switch (typeSplit[1]) {
        case 'frame':
          setFrameSettings(getFrameSelection(), msg.data);
          break;

        case 'components':
          setComponentGroupSettings(getFrameSelection(), typeSplit[2], msg.data);
          break;

        case 'colors':
          setColorGroupSettings(getFrameSelection(), typeSplit[2], msg.data);
          break;
      }
      break;

    case 'export':
      processTask(async () => ({
        type: 'export',
        data: await createExport(),
      }));
      break;
  }
};
