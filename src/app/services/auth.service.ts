import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { environment } from '../environments/environments';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest, LoginResponse, AuthError } from 'src/app/models/auth.model';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

   login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { EmailAddress: email, password }; // Typed with interface
    console.log('Sending login request:', loginData);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error.error as AuthError); // Typed error
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

//   login(email: string, password: string) {
//     return this.http
//       .post<{ token: string }>(`${environment.apiUrl}/users/login`, {
//         email,
//         password,
//       })
//       .pipe(
//         tap((response) => {
//           if (response.token) {
//             localStorage.setItem(this.tokenKey, response.token);
//           }
//         })
//       );
//   }
//     logout() {
//     throw new Error('Method not implemented.');
//   }
//  isAuthenticated(): boolean {
//   // authentication logic
//   // return true or false based on authentication state
//   return !!this.getToken(); // Example: returns true if token exists
  
// }

//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }
//   isTokenExpired(): boolean {
//     const token = this.getToken();
//     return token ? this.jwtHelper.isTokenExpired(token) : true;
//   }

