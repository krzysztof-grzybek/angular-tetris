import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

export interface Brick {
  left: number;
  top: number;
}

@Component({
  selector: 'app-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrickComponent {
  @Input() model: Brick | null = null;
}
