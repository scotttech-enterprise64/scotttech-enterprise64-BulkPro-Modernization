import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkproRoutingModule } from './bulkpro-routing.module';
import { MaterialModule } from 'src/app/material-module';
import { GeneralModule } from 'src/app/general-module';
import { DesignCycleCountComponent } from './Design/cycle-count/cycle-count.component';
import { DesignPickComponent } from './Design/pick/pick.component';
import { CycleCountComponent } from './cycle-count/cycle-count.component';
import { PickComponent } from './pick/pick.component';
import { ScanOrderComponent } from './cycle-count/scan-order/scan-order.component';
import { ScanLocationComponent } from './cycle-count/scan-location/scan-location.component';
import { ScanItemComponent } from './cycle-count/scan-item/scan-item.component';
import { SetCountComponent } from './cycle-count/set-count/set-count.component';
import { CustomMsgWindowComponent } from './cycle-count/custom-msg-window/custom-msg-window.component';
import { ScanOrdBatTotComponent } from './pick/scan-ord-bat-tot/scan-ord-bat-tot.component';
import { ItemLocationComponent } from './item-location/item-location.component';
import { ScanItemOrLocationComponent } from './item-location/scan-item-or-location/scan-item-or-location.component';
import { LocationDetailsComponent } from './item-location/location-details/location-details.component';

@NgModule({
  declarations: [
    CycleCountComponent,
    DesignCycleCountComponent,
    DesignPickComponent,
    PickComponent,
    ScanOrderComponent,
    ScanLocationComponent,
    ScanItemComponent,
    SetCountComponent,
    CustomMsgWindowComponent,
    ScanOrdBatTotComponent,
    ItemLocationComponent,
    ScanItemOrLocationComponent,
    LocationDetailsComponent
  ],
  imports: [
    CommonModule,
    BulkproRoutingModule,
    MaterialModule,
    GeneralModule
  ]
})
export class BulkproModule { }
