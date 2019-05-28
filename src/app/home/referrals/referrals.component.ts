import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public facebookTransitiongoal = 87;
  public tweeterTransitiongoal = 34;
  public searchTransitiongoal = 54;
  public visitsTransitiongoal = 67;

  constructor() {}

  ngOnInit() {}
}
