import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestrecordComponent } from './requestrecord.component';

describe('RequestrecordComponent', () => {
  let component: RequestrecordComponent;
  let fixture: ComponentFixture<RequestrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestrecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
