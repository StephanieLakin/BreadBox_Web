import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { LeadsComponent } from './components/leads/leads.component';
import { authGuard } from './auth.guard';
import { LeadService } from './services/lead.service';
import { ClientsComponent } from './components/clients/clients.component';
import { CommonModule } from '@angular/common';

export function tokenGetter() {
  return localStorage.getItem('auth_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LeadsComponent,
    ClientsComponent
  ],
imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:44394'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    AuthService,
    LeadService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
