import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerContactComponent } from './messenger-contact.component';

describe('MessengerContactComponent', () => {
  let component: MessengerContactComponent;
  let fixture: ComponentFixture<MessengerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
