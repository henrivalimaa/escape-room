import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitTheButtonsComponent } from './hit-the-buttons.component';

describe('HitTheButtonsComponent', () => {
  let component: HitTheButtonsComponent;
  let fixture: ComponentFixture<HitTheButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitTheButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitTheButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
