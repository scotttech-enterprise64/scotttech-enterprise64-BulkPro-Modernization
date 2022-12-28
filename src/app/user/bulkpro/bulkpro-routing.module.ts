import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardGuard } from '../../guards/guard.guard';
import { CycleCountComponent } from './cycle-count/cycle-count.component';
import { DesignCycleCountComponent } from './Design/cycle-count/cycle-count.component';
import { DesignPickComponent } from './Design/pick/pick.component';

const routes: Routes = [
      { path: '', component: CycleCountComponent },
      {
        path: 'design-cycle-count',
        component: DesignCycleCountComponent,
        canActivate:[GuardGuard]
      },
      {
        path: 'design-pick',
        component: DesignPickComponent,
        canActivate:[GuardGuard]
      },
      {
        path: 'cycle-count',
        component: CycleCountComponent,
        canActivate:[GuardGuard]
      },
      {
        path: 'pick',
        component: CycleCountComponent,
        canActivate:[GuardGuard]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkproRoutingModule { }
