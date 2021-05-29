import {Component, Input, OnInit} from '@angular/core';

export interface Brick {
  left: number;
  top: number;
}

@Component({
  selector: 'app-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss']
})
export class BrickComponent implements OnInit {
  @Input() model: Brick | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  hop() {
    console.log('brick')
  }
}
