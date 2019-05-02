import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsModalComponent } from './charts-modal.component';

describe('ChartsModalComponent', () => {
  let component: ChartsModalComponent;
  let fixture: ComponentFixture<ChartsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
