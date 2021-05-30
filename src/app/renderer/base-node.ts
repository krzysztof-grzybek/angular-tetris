import {Node, ParentContainerPosition} from './node';

export class BaseNode implements Node {
  parentNode: Node | null = null;
  children: Node[] = [];
  properties: { [key: string]: any } = {};
  position = {
    left: 0,
    top: 0
  };
  size = {
    width: 0,
    height: 0,
  };

  get nextSibling(): Node | null {
    if (this.parentNode === null) {
      return null;
    }

    const index = this.parentNode.children.findIndex(child => child === this);
    return this.parentNode.children[index + 1];
  }

  appendChild(child: Node): Node {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  insertBefore(newChild: Node, refChild: Node): Node {
    const index = this.children.findIndex(c => c === refChild);
    if (index === undefined) {
      throw new Error('RefChild not found');
    }
    this.children.splice(index, 0 , newChild);
    newChild.parentNode = this;
    return newChild;
  }

  removeChild(child: Node): Node {
    const index = this.children.findIndex(c => c === child);
    this.children.splice(index, 1   );
    return child;
  }

  setAttribute(key: string, value: any): void {
    this.properties[key] = value;
  }

  getAttribute(key: string): any {
   return this.properties[key];
  }

  render(canvasEl: HTMLCanvasElement, parentContainerPosition: ParentContainerPosition): void {
    this.children.forEach((child) => {
      child.render(canvasEl, parentContainerPosition);
    });
  }
}
