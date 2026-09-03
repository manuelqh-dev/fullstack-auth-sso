import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import {SsoCallbackComponent} from "./features/login/sso-callback.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sso/callback', component: SsoCallbackComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
