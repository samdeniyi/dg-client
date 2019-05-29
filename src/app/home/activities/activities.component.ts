import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  public posts: Array<any> = new Array<any>();
  constructor() {
    this.posts = [
      {
        class: 'green',
        date: '20-04-2018 - Today',
        header: "Login in",
        user: 'Elisse Joson',
        location: 'San Francisco, CA',
        message:
          "I'm speaking with myself, number one, because I have a very good brain and I've said a lot of things. I write the best placeholder text, and I'm the biggest developer on the web card she has is the Lorem card."
      }
    ];
  }

  ngOnInit() {}
}
