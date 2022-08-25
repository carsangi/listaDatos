import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationrecordComponent } from './activationrecord.component';

describe('ActivationrecordComponent', () => {
  let component: ActivationrecordComponent;
  let fixture: ComponentFixture<ActivationrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivationrecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivationrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
