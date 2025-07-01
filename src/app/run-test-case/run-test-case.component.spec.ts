import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunTestCaseComponent } from './run-test-case.component';

describe('RunTestCaseComponent', () => {
  let component: RunTestCaseComponent;
  let fixture: ComponentFixture<RunTestCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunTestCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
