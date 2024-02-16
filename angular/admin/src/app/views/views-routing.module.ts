import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './activities/activities.component';
import { ViewsComponent } from './views.component';

const routes: Routes = [
  {
    path: "",
    component: ViewsComponent,
    children: [
      {
        path: "",
        component: ActivitiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
