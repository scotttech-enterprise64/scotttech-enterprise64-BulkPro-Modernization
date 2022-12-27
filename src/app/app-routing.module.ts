import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './guards/guard.guard';
import { LoginComponent } from './login/login.component';
import { CycleCountComponent } from './user/dashboard/cycle-count/cycle-count.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { MainComponent } from './user/dashboard/main/main.component';
import { PickComponent } from './user/dashboard/pick/pick.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: MainComponent,
        canActivate:[GuardGuard]
      },
      {
        path: 'pick',
        component: PickComponent,
        canActivate:[GuardGuard]
      },
      {
        path: 'cycle-count',
        component: CycleCountComponent,
        canActivate:[GuardGuard]
      },

    ],
    canActivate: [GuardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
