import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from './guards/guard.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { MainComponent } from './user/dashboard/main/main.component';

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
        canActivate:[GuardService]
      },
      {
        path: 'dashboard/:appName',
        component: MainComponent,
        canActivate:[GuardService]
      },
      { 
        path: 'bulkpro',
        loadChildren: () => import('./user/bulkpro/bulkpro.module').then(m => m.BulkproModule),
        canActivate:[GuardService]
      }
    ],
    canActivate: [GuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
