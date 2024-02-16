import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path:"auth/:page",
    component:LoginComponent
  },
  {
    path:"auth",
    redirectTo:"auth/login",
    pathMatch:"full"
  },
  {
    path:"",
    loadChildren:()=>import("./views/views.module").then(x=>x.ViewsModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration:"enabled"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
