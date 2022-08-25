import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationstatusComponent } from './activationstatus.component';

describe('ActivationstatusComponent', () => {
  let component: ActivationstatusComponent;
  let fixture: ComponentFixture<ActivationstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivationstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivationstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
