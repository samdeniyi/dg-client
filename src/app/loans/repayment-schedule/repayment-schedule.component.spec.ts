import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentScheduleComponent } from './repayment-schedule.component';

describe('RepaymentScheduleComponent', () => {
  let component: RepaymentScheduleComponent;
  let fixture: ComponentFixture<RepaymentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepaymentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
