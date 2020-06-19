import * as svgson from 'svgson';
export declare function parse(svg: string | svgson.INode): svgson.INode;
export declare function stringify(svg: string | svgson.INode): string;
export declare function getViewbox(svg: svgson.INode): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function addWidth(svg: svgson.INode, width: number): void;
export declare function addHeight(svg: svgson.INode, height: number): void;
export declare function addMargin(svg: svgson.INode, margin: number): void;
export declare function addBackground(svg: svgson.INode, background: string): void;
export declare function addRadius(svg: svgson.INode, radius: number): void;
export declare function isGroupable(element: svgson.INode): boolean;
