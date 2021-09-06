import { getNameParts } from './getNameParts';

export function isSupportedComponent(component: ComponentNode) {
  const componentGroup = getNameParts(component.name).group;

  return (
    component.parent?.type === 'PAGE' &&
    componentGroup.length > 0 &&
    false === component.remote &&
    component.children.length > 0 &&
    component.visible
  );
}
