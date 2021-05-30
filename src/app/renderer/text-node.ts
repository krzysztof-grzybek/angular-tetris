import {BaseNode} from './base-node';
import {ParentContainerPosition} from './node';

export class TextNode extends BaseNode {
  textContent = '';

  render(canvasEl: HTMLCanvasElement, parentContainerPosition: ParentContainerPosition): void {
    const ctx = canvasEl.getContext('2d');
    if (ctx === null) {
      throw new Error('Context not found canvas');
    }

    const left = this.position.left + parentContainerPosition.left;
    const top = this.position.top + parentContainerPosition.top;

    ctx.font = '12px serif';
    ctx.textBaseline = 'hanging';
    ctx.fillText(this.textContent, left, top);
  }
}
