import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeOrderComponent } from './organize-order.component';

describe('OrganizeOrderComponent', () => {
  let component: OrganizeOrderComponent;
  let fixture: ComponentFixture<OrganizeOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
