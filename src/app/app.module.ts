import {BrowserModule, EventManager} from '@angular/platform-browser';
import {APP_ID, NgModule, NgZone, RendererFactory2} from '@angular/core';
import {
  ɵDomSharedStylesHost as DomSharedStylesHost,
} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CanvasRendererFactory} from './canvasRendererFactory';
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
      deps: [EventManager, DomSharedStylesHost, APP_ID, NgZone],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
