import {BaseNode} from './base-node';
import {Node, ParentContainerPosition} from './node';

interface BoxNodeProperties {
  color: string;
  border: number;
}

const DEFAULT_PROPERTIES: BoxNodeProperties = {
  color: 'black',
  border: 1,
};

export class BoxNode extends BaseNode {
  private color = 'black';
  children: Node[] = [];
  border = 1;
  size = {
    width: 100,
    height: 100,
  };
  properties: BoxNodeProperties = DEFAULT_PROPERTIES;

  render(canvasEl: HTMLCanvasElement, parentContainerPosition: ParentContainerPosition): void {
    const ctx = canvasEl.getContext('2d');
    if (ctx === null) {
      throw new Error('Context not found on canvas');
    }

    const left = this.position.left + parentContainerPosition.left;
    const top = this.position.top + parentContainerPosition.top;

    ctx.strokeStyle = this.properties.color;
    ctx.lineWidth = this.properties.border;
    ctx.beginPath();
    ctx.rect(left, top, this.size.width, this.size.height);
    ctx.stroke();
    ctx.closePath();

    this.children.forEach(child => {
      child.render(canvasEl, { left, top });
    });
  }
}
