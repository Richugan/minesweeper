import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotCleanerComponent } from './robot-cleaner.component';

describe('RobotCleanerComponent', () => {
  let component: RobotCleanerComponent;
  let fixture: ComponentFixture<RobotCleanerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotCleanerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotCleanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
