import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-actions',
  templateUrl: './card-actions.component.html',
  styleUrls: ['./card-actions.component.scss']
})
export class CardActionsComponent implements OnInit {
  public showActions = false;
  public actions: Array<any> = [
    { key: 'Action', url: '' },
    { key: 'Another Action', url: '' },
    { key: 'Something else', url: '' }
  ];

  constructor() {}

  ngOnInit() {}
}
