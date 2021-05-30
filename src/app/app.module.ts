import {BrowserModule, EventManager} from '@angular/platform-browser';
import {APP_ID, NgModule, NgZone, RendererFactory2} from '@angular/core';
import {
  ɵDomSharedStylesHost as DomSharedStylesHost,
} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CanvasRendererFactory} from './renderer/canvas-renderer-factory';
import { ShapeComponent } from './shape/shape.component';
import { BrickComponent } from './brick/brick.component';


@NgModule({
  declarations: [
    AppComponent,
    ShapeComponent,
    BrickComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    {
      provide: RendererFactory2,
      useClass: CanvasRendererFactory,
      deps: [EventManager, NgZone],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
