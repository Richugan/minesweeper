import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeBuilderComponent } from './bridge-builder.component';

describe('BridgeBuilderComponent', () => {
  let component: BridgeBuilderComponent;
  let fixture: ComponentFixture<BridgeBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
