import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
    exports: [
        NgScrollbarModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule        
    ]
})
export class GeneralModule { }