import { Component } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Brick} from './brick/brick.component';
import {Shape} from './shape/shape.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-canvas';
  color = 'blue';
  score = 350;
  busyBricks$: Observable<Brick[]> = new BehaviorSubject([{ top: 200, left: 200 }, { top: 50, left: 50 }, { top: 100, left: 100 }]);
  currentShape$: Observable<Shape> = new BehaviorSubject({ bricks: [{ top: 400, left: 50 }] });
  nextShape$: Observable<Shape> = new BehaviorSubject({ bricks: [{ top: 50, left: 100 } ] });
elo = 0;
  constructor() {

    setInterval(() => {
      this.elo += 50;
      // const next = this.color === 'blue' ? [{ top: 250, left: 200 }, { top: 100, left: 50 }, { top: 150, left: 100 }] :[{ top: 200, left: 200 }, { top: 50, left: 50 }, { top: 100, left: 100 }]
      // @ts-ignore
      this.busyBricks$.next([{ top: this.elo, left: 200 }, { top: this.elo, left: 50 }, { top: this.elo, left: 100 }])
      // this.color = this.color === 'blue' ? 'green' : 'blue';
    }, 1000  );
  }
}
