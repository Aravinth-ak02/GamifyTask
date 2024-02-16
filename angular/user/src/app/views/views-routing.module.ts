import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewsComponent } from './views.component';
import { AuthGuard } from '../helpers/auth.guard';

const routes: Routes = [
  {
    path:"",
    component:ViewsComponent,
    children:[
      {
        path: "",
        component: DashboardComponent
      },
      {
        path: ":type/:id",
        component: DashboardComponent
      },
      {
        path: ":type",
        component: DashboardComponent,
        // canActivate:[AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
