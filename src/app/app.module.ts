import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RunTestCaseComponent } from './run-test-case/run-test-case.component';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    AppComponent,
    AddTestCaseComponent,
    RunTestCaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatToolbarModule, MatIconModule,
    NgApexchartsModule,
    MatCheckboxModule, MatTableModule,MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
