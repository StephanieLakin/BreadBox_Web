 import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environments';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-leads',
   standalone: false,
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leads: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      window.location.href = '/login';
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/leads`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (data) => this.leads = data,
      error: (err) => {
        console.error('Error fetching leads', err);
        // Simple alert as a replacement for toast
        alert('Failed to load leads. Check the console for details.');
      }
    });
  }
}