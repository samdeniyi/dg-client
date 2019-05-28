import { Component, Input, OnInit } from '@angular/core';

export interface IAlertMessage {
  type: string;
  message: string;
  icon: string;
  showClose: boolean;
}

export enum EAlertMessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger'
}

export enum EAlertMessageIcon {
  INFO = 'fa-info-circle',
  SUCCESS = 'fa-check-circle',
  WARNING = 'fa-warning',
  DANGER = 'fa-times-circle'
}

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {
  @Input() options: IAlertMessage;

  public showElement: boolean = true;

  constructor() {}

  ngOnInit() {}

  toggleElement() {
    this.showElement = !this.showElement;
  }
}
