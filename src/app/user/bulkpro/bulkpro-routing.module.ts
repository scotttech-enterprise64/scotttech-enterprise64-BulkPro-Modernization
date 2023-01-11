import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../../guards/guard.guard';
import { BulkproComponent } from './bulkpro.component';
import { CycleCountComponent } from './cycle-count/cycle-count.component';
import { DesignCycleCountComponent } from './Design/cycle-count/cycle-count.component';
import { DesignPickComponent } from './Design/pick/pick.component';
import { ItemLocationComponent } from './item-location/item-location.component';
import { PickComponent } from './pick/pick.component';

const routes: Routes = [
      { path: '', component: BulkproComponent },
      {
        path: 'design-cycle-count',
        component: DesignCycleCountComponent,
        canActivate:[GuardService]
      },
      {
        path: 'design-pick',
        component: DesignPickComponent,
        canActivate:[GuardService]
      },
      {
        path: 'cycle-count',
        component: CycleCountComponent,
        canActivate:[GuardService]
      },
      {
        path: 'pick',
        component: PickComponent,
        canActivate:[GuardService]
      },
      {
        path: 'item-location',
        component: ItemLocationComponent,
        canActivate:[GuardService]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkproRoutingModule { }
