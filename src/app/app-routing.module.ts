import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { LeadsComponent } from '../app/components/leads/leads.component';
import { authGuard } from './auth.guard';
import { ClientsComponent } from './components/clients/clients.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'leads', component: LeadsComponent, canActivate:[authGuard] }, 
   { path: 'clients', component: ClientsComponent, canActivate:[authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
