import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightPatternComponent } from './light-pattern.component';

describe('LightPatternComponent', () => {
  let component: LightPatternComponent;
  let fixture: ComponentFixture<LightPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
