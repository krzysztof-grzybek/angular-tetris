import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Brick} from '../brick/brick.component';

export interface Shape {
  bricks: Brick[];
}

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeComponent {
  @Input() model!: Shape;
}
