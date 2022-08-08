import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastmonthComponent } from './lastmonth.component';

describe('LastmonthComponent', () => {
  let component: LastmonthComponent;
  let fixture: ComponentFixture<LastmonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastmonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
