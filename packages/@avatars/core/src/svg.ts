import * as svgson from 'svgson';

export function parse(svg: string | svgson.INode) {
  return typeof svg === 'string' ? svgson.parseSync(svg) : svg;
}

export function stringify(svg: string | svgson.INode) {
  return typeof svg === 'string' ? svg : svgson.stringify(svg);
}

export function getViewbox(svg: svgson.INode) {
  let viewBox = svg.attributes['viewBox'].split(' ');
  let x = parseInt(viewBox[0]);
  let y = parseInt(viewBox[1]);
  let width = parseInt(viewBox[2]);
  let height = parseInt(viewBox[3]);

  return {
    x,
    y,
    width,
    height,
  };
}

export function addWidth(svg: svgson.INode, width: number) {
  svg.attributes['width'] = width.toString();
}

export function addHeight(svg: svgson.INode, height: number) {
  svg.attributes['height'] = height.toString();
}

export function addMargin(svg: svgson.INode, margin: number) {
  let groupable: svgson.INode[] = [];
  let viewBox = getViewbox(svg);

  svg.children = svg.children.filter((child) => {
    if (isGroupable(child)) {
      groupable.push(child);

      return false;
    }

    return true;
  });

  svg.children.push({
    name: 'g',
    type: 'element',
    value: '',
    children: [
      {
        name: 'g',
        type: 'element',
        value: '',
        children: [
          {
            name: 'rect',
            type: 'element',
            value: '',
            children: [],
            attributes: {
              fill: 'none',
              width: viewBox.width.toString(),
              height: viewBox.height.toString(),
              x: viewBox.x.toString(),
              y: viewBox.y.toString(),
            },
          },
          ...groupable,
        ],
        attributes: {
          transform: `scale(${1 - (margin * 2) / 100})`,
        },
      },
    ],
    attributes: {
      // prettier-ignore
      transform: `translate(${viewBox.width * margin / 100}, ${viewBox.height * margin / 100})`
    },
  });
}

export function addBackground(svg: svgson.INode, background: string) {
  let viewBox = getViewbox(svg);

  svg.children.unshift({
    name: 'rect',
    type: 'element',
    value: '',
    children: [],
    attributes: {
      fill: background,
      width: viewBox.width.toString(),
      height: viewBox.height.toString(),
      x: viewBox.x.toString(),
      y: viewBox.y.toString(),
    },
  });
}

export function addRadius(svg: svgson.INode, radius: number) {
  let groupable: svgson.INode[] = [];
  let viewBox = getViewbox(svg);

  svg.children = svg.children.filter((child) => {
    if (isGroupable(child)) {
      groupable.push(child);

      return false;
    }

    return true;
  });

  svg.children.push(
    {
      name: 'mask',
      type: 'element',
      value: '',
      children: [
        {
          name: 'rect',
          type: 'element',
          value: '',
          children: [],
          attributes: {
            width: viewBox.width.toString(),
            height: viewBox.height.toString(),
            rx: ((viewBox.width * radius) / 100).toString(),
            ry: ((viewBox.height * radius) / 100).toString(),
            fill: '#fff',
            x: viewBox.x.toString(),
            y: viewBox.y.toString(),
          },
        },
      ],
      attributes: {
        id: 'avatarsRadiusMask',
      },
    },
    {
      name: 'g',
      type: 'element',
      value: '',
      children: groupable,
      attributes: {
        mask: `url(#avatarsRadiusMask)`,
      },
    }
  );
}

export function isGroupable(element: svgson.INode) {
  return element.type === 'element' && ['title', 'desc', 'defs', 'metadata'].indexOf(element.name) === -1;
}
