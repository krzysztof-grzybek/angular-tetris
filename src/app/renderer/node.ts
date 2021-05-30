export interface ParentContainerPosition {
  left: number;
  top: number;
}

export interface Node {
  position: {
    left: number;
    top: number;
  };
  size: {
    width: number;
    height: number;
  };
  parentNode: Node | null;
  children: Node[];
  nextSibling: Node | null;
  render(canvasEl: HTMLCanvasElement, parentContainerPosition: ParentContainerPosition): void;
  insertBefore(newChild: Node, refChild: Node): void;
  removeChild(oldChild: Node): void;
  appendChild(child: Node): Node;
  setAttribute(key: string, value: string): void;
  getAttribute(key: string): string;
}
