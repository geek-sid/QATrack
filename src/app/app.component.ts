import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { _MatTableDataSource, MatTable, MatTableDataSource } from '@angular/material/table';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { MatDialog } from '@angular/material/dialog';
import { RunTestCaseComponent } from './run-test-case/run-test-case.component';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ['select', 'id', 'title', 'owner', 'lastResults', 'action'];
  displayedRunColumns: string[] = ['id', 'title', 'owner', 'lastResults', 'action'];
  runDataSource = new _MatTableDataSource<TestCase>();
  dataSource = new MatTableDataSource<TestCase>(TEST_CASES);
  notRunCount: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  blockedCount: number;
  showDashboard:boolean = false;
  selection = new SelectionModel<TestCase>(true, []);
  @ViewChild(MatTable) tcTable: MatTable<any>;
  @ViewChild(MatTable) trTable: MatTable<any>;
  title = 'QATrack';
  displayTestCases: boolean = true;
  runTestCases: boolean = false;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(public dialog: MatDialog) {
    this.calculateCount();
    this.chartOptions = {
      series: [this.notRunCount, this.passedCount, this.skippedCount, this.failedCount, this.blockedCount],
      chart: {
        type: "donut",
        width: 300,
        height: 300
      },
      labels: ["Not Run", "Passed", "Skipped", "Failed", "Blocked"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTestCaseComponent, {
      width: "44rem",
      minHeight: "41rem",
      maxHeight: "67vh",
      panelClass:"addTestCase_dialog",
      data: {},
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.testCaseValue) {
        let testcase: TestCase = {
          id: (this.dataSource.data.length + 1),
          title: result.testCaseValue.title,
          owner: result.testCaseValue.owner,
          lastResults: 'Not Run',
          priority: result.testCaseValue.priority,
          type: result.testCaseValue.type,
          precondition: result.testCaseValue.precondition,
          steps: result.testCaseValue.steps,
          resultInformation: ''
        };
        this.dataSource.data.push(testcase);
        this.tcTable.renderRows();
      }
    });
  }
  calculateCount() {
    this.notRunCount = this.dataSource.data.filter(test => test.lastResults == 'Not Run').length;
    this.passedCount = this.dataSource.data.filter(test => test.lastResults == 'Passed').length;
    this.failedCount = this.dataSource.data.filter(test => test.lastResults == 'Failed').length;
    this.skippedCount = this.dataSource.data.filter(test => test.lastResults == 'Skipped').length;
    this.blockedCount = this.dataSource.data.filter(test => test.lastResults == 'Blocked').length;
  }
  editDialog(testCase: any) {
    const dialogRef = this.dialog.open(AddTestCaseComponent, {
      width: "44rem",
      minHeight: "41rem",
      maxHeight: "67vh",
      data: { testObj: testCase },
      panelClass:"addTestCase_dialog",
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.testCaseValue) {
        let testCase = this.dataSource.data[(result.testCaseValue.id - 1)];
        testCase.title = result.testCaseValue.title;
        testCase.owner = result.testCaseValue.owner;
        testCase.priority = result.testCaseValue.priority;
        testCase.type = result.testCaseValue.type;
        testCase.precondition = result.testCaseValue.precondition;
        testCase.steps = result.testCaseValue.steps;
        this.dataSource.data[(result.testCaseValue.id - 1)] = testCase;
        this.tcTable.renderRows();
      }
    });
  }

  runTestCaseDialog(testCase: any) {
    const dialogRef = this.dialog.open(RunTestCaseComponent, {
      width: "44rem",
      minHeight: "41rem",
      maxHeight: "67vh",
      data: { testObj: testCase },
      panelClass:"addTestCase_dialog",
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.testCaseValue) {
        this.runDataSource.data.forEach(test => {
          if (test.id == result.testCaseValue.id) {
            test.owner = result.testCaseValue.owner;
            test.lastResults = result.testCaseValue.lastResults;
            test.resultInformation = result.testCaseValue.resultInformation;
          }
        });
        this.trTable.renderRows();
        let testCase = this.runDataSource.data[(result.testCaseValue.id - 1)];
        testCase.owner = result.testCaseValue.owner;
        testCase.lastResults = result.testCaseValue.lastResults;
        testCase.resultInformation = result.testCaseValue.resultInformation;
        this.dataSource.data[(result.testCaseValue.id - 1)] = testCase;
        this.tcTable.renderRows();
      }
    });
  }

  toggleDashboard(){
    this.showDashboard =!this.showDashboard;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TestCase): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  showTestCases() {
    this.displayTestCases= true;
    this.runTestCases = false;
    this.selection.clear();
    this.calculateCount();
    this.chartOptions.series = [this.notRunCount, this.passedCount, this.skippedCount, this.failedCount, this.blockedCount];
  }

  showTestRun() {
    this.runDataSource.data = [];
    this.runDataSource.data = this.selection.selected;
    this.runTestCases = !this.runTestCases;
    this.displayTestCases = false;
    this.trTable.renderRows();
  }
}
export interface TestCase {
  id: number;
  title: string;
  owner: string;
  lastResults: string;
  priority: string;
  type: string;
  precondition: string;
  steps: string;
  resultInformation: string;
}

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

const TEST_CASES: TestCase[] = [
  {
    id: 1,
    title: 'Validate that on the table a button is present there named" Add new model"',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'UI',
    precondition: 'User should have credentials of RAAVN-IEW',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button'",
    resultInformation: ''
  },
  {
    id: 2,
    title: 'Validate that on click of "Add new model" button a form is getting opened.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button, Click on Add new Model button'",
    resultInformation: ''
  },
  {
    id: 3,
    title: 'Validate that on popup "Model family" , "Model Region" dropdown fields are getting shown',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'High',
    type: 'UI',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button', 'Click on Add new Model button', 'Verify the dropdown fields'"
  },
  {
    id: 4,
    title: 'Validate that after selecting model family a free text field is getting shown with header "model name".',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button', 'Click on Add new Model button', 'Verify the field Model name'"
  },
  {
    id: 5,
    title: 'Validate that a free text field "Model name" is accepting any type of character',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button', 'Click on Add new Model button', 'Verify the field Model name is accepting all chars'"
  },
  {
    id: 6,
    title: 'Validate that on submit confirmation box has the header "•	“Are you sure you want to create the "MODEL FAMILY – MODEL NAME" model?" with confirmation buttons "Yes" &"no".',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Verify the Add new Model Button', 'Click on Add new Model button', 'Enter all fields and click on submit'"
  },
  {
    id: 7,
    title: 'Validate that on click of "yes" new model add message is getting shown or not as "Model Added successfully"',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'High',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW', 'Navigate to Model manager' ,'Verify the Add new Model Button', 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes'"
  },
  {
    id: 8,
    title: 'Validate that on click of "No" popup is getting closed',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW ', 'Navigate to Model manager ','Verify the Add new Model Button', 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on No'"
  },
  {
    id: 9,
    title: 'Validate that once new model is added successfully the same is getting shown on model name field on "Upload new alert " form.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager ', 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Navigate to Upload new Alert button' , 'Validate the added model in Model field.'"
  },
  {
    id: 10,
    title: 'Validate that once new model is added successfully the same is getting shown on model name field on Review/Feedback forms.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW ', 'Navigate to Model manager ', 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Navigate to review Queue', 'Click on Review' , 'Validate the added model in Model field.'"
  },
  {
    id: 11,
    title: 'Validate that once new model is added successfully the same is getting shown on model name field on subscription form.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' , 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Navigate to Subscription Info', 'Click on Any username' , 'Validate the added model'"
  },
  {
    id: 12,
    title: 'Validate that once new model is added successfully the same is getting shown on  “Topic” – Dropdown in Filter Box',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' ,'Click on Add new Model button', 'Enter all fields and click on submit',' Click on yes', 'Navigate to Homepage',' Navigate to Filters' , 'Validate the added model'"
  },
  {
    id: 13,
    title: 'Validate that deactivated and deleted users are not getting any email.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW', 'Navigate to Model manager' , 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Validate the deactivated and deleted users are not getting emails'"
  },
  {
    id: 14,
    title: 'Validate that - Users currently subscribed to the designated model family are automatically getting updated to include the new model',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW', 'Navigate to Model manager' ,'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Chose any user who is already subscribed that model family', 'validate newly added model is automatically subscribed'"
  },
  {
    id: 15,
    title: 'Validate that Users who do not have models selected from the designated mode  l family will not have their model subscriptions updated with the new model.',
    owner: 'Amit Kumar',
    lastResults: 'Not Run',
    priority: 'Medium',
    type: 'Functional',
    precondition: '',
    resultInformation: '',
    steps: "'Sign in to RAAVN-IEW' , 'Navigate to Model manager' , 'Click on Add new Model button', 'Enter all fields and click on submit', 'Click on yes', 'Chose any user who has not subscribed that model family', 'validate newly added model is not automatically subscribed'"
  },
]