import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestCaseComponent } from './add-test-case.component';

describe('AddTestCaseComponent', () => {
  let component: AddTestCaseComponent;
  let fixture: ComponentFixture<AddTestCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTestCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
