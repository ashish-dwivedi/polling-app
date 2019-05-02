import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-toot-card',
  templateUrl: './toot-card.component.html',
  styleUrls: ['./toot-card.component.scss']
})
export class TootCardComponent implements OnInit {

  @Input()
  toot: any;

  @Input()
  tagSearch: any;

  @Input()
  isWinner: boolean;

  @Output()
  onTootCardClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
