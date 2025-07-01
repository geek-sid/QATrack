import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestCase } from '../app.component';

@Component({
  selector: 'app-add-test-case',
  templateUrl: './add-test-case.component.html',
  styleUrls: ['./add-test-case.component.scss']
})
export class AddTestCaseComponent {
  testCaseForm: FormGroup;
  addbuttonLabel : string ="Create";

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, public fb: FormBuilder, public dialogRef: MatDialogRef<AddTestCaseComponent>) {
    this.testCaseForm = this.fb.group({
      id: [''],
      title: [''],
      owner: [''],
      lastResults: [''],
      priority: [''],
      type: [''],
      precondition: [''],
      steps: [''],
    });
    if (dialogData?.testObj) {
      let testObj: TestCase = dialogData.testObj;
      this.testCaseForm.get("id").setValue(testObj.id);
      this.testCaseForm.get("title").setValue(testObj.title);
      this.testCaseForm.get("owner").setValue(testObj.owner);
      this.testCaseForm.get("priority").setValue(testObj.priority);
      this.testCaseForm.get("lastResults").setValue(testObj.lastResults);
      this.testCaseForm.get("type").setValue(testObj.type);
      this.testCaseForm.get("precondition").setValue(testObj.precondition);
      this.testCaseForm.get("steps").setValue(testObj.steps);
      this.addbuttonLabel="Save";
    }
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
  addTestCase(){
    let testCase = this.testCaseForm.value;
    this.dialogRef.close({testCaseValue: testCase});
  }

}
