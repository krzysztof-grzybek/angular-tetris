import {Injectable, NgZone, Renderer2, RendererFactory2, RendererType2} from '@angular/core';
import {CanvasRenderer} from './canvasRenderer';
import {EventManager} from '@angular/platform-browser';

@Injectable()
export class CanvasRendererFactory implements RendererFactory2 {
  constructor(private eventManager: EventManager, private domHost: any, elo: any, private ngZone: NgZone) {
  }
  createRenderer(element: any, type: RendererType2 | null): Renderer2 {
    // let canvasEl!: HTMLCanvasElement;
    // if (element) {

    const canvasEl = document.querySelector('canvas')!;
    return new CanvasRenderer(this.eventManager, canvasEl, this.ngZone);
  }

  // private craeteCanvasEL() {
  //   return document.createElement('canvas');
  // }
}
