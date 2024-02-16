import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './helper/auth.guard';

const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },{
    path:"",
    loadChildren:()=>import("./views/views.module").then(x=>x.ViewsModule),
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
