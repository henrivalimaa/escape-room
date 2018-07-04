import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerMediaComponent } from './messenger-media.component';

describe('MessengerMediaComponent', () => {
  let component: MessengerMediaComponent;
  let fixture: ComponentFixture<MessengerMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
