import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerShellComponent } from './inner-shell.component';

describe('InnerShellComponent', () => {
  let component: InnerShellComponent;
  let fixture: ComponentFixture<InnerShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
