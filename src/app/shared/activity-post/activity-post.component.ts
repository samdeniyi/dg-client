import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-post',
  templateUrl: './activity-post.component.html',
  styleUrls: ['./activity-post.component.scss']
})
export class ActivityPostComponent implements OnInit {
  @Input() post: any = {};

  public showComment = false;
  constructor() {}

  ngOnInit() {}

  toggleComment() {
    this.showComment = !this.showComment;
  }
}
