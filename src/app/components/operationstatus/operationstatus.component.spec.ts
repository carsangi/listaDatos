import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationstatusComponent } from './operationstatus.component';

describe('OperationstatusComponent', () => {
  let component: OperationstatusComponent;
  let fixture: ComponentFixture<OperationstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
