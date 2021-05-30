import {Injectable, NgZone, Renderer2, RendererFactory2, RendererType2} from '@angular/core';
import {CanvasRenderer} from './canvas-renderer';
import {EventManager} from '@angular/platform-browser';

@Injectable()
export class CanvasRendererFactory implements RendererFactory2 {
  constructor(private eventManager: EventManager, private ngZone: NgZone) {
  }

  createRenderer(element: any, type: RendererType2 | null): Renderer2 {
    const canvasEl = document.querySelector('canvas');
    if (canvasEl === null) {
      throw new Error('Canvas element not found in document');
    }
    return new CanvasRenderer(this.eventManager, canvasEl, this.ngZone);
  }
}
