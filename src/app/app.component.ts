import { Component } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Brick} from './brick/brick.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-canvas';
  color = 'blue';
  widthIn = 50;
  score = 350;
  busyBricks$: Observable<Brick[]> = new BehaviorSubject([{ top: 200, left: 200 }, { top: 50, left: 50 }, { top: 100, left: 100 }]);
  currentShape$: Observable<Brick[]> = new BehaviorSubject([{ top: 100, left: 30 }]);
  nextShape$: Observable<Brick[]> = new BehaviorSubject([{ top: 50, left: 100 }]);

  constructor() {
    setInterval(() => {
      const next = this.color === 'blue' ? [{ top: 250, left: 200 }, { top: 100, left: 50 }, { top: 150, left: 100 }] :[{ top: 200, left: 200 }, { top: 50, left: 50 }, { top: 100, left: 100 }]
      this.busyBricks$.next(next)
      this.color = this.color === 'blue' ? 'green' : 'blue';
    }, 1000);
    setInterval(() => {
      this.widthIn = this.widthIn === 50 ? 70 : 50;
    }, 1000);
  }

  hop() {
    console.log('elo')
  }
}
