import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../../material-module';
import { HeaderComponent } from 'src/app/header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BatchCompletedComponent } from 'src/app/dialogs/batch-completed/batch-completed.component';
import { GeneralModule } from 'src/app/general-module';

// import { GeneralModule } from '../gen-module';



@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    DashboardComponent,
    SidebarComponent,
    BatchCompletedComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GeneralModule
  ]
})
export class DashboardModule { }
