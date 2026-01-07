 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environments';
import { Lead } from '../models/lead.model'; 


@Injectable({
    providedIn: 'root'
})
export class LeadService {
  constructor(private http: HttpClient) {}

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${environment.apiUrl}/leads`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }

  createLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(`${environment.apiUrl}/leads`, lead, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }

  updateLead(lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(`${environment.apiUrl}/leads/${lead.id}`, lead, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }

  deleteLead(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/leads/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    });
  }
}