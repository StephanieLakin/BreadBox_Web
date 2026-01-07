import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leads',
  standalone: false,
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  newLead: Lead = { id: 0, name: '', emailAddress: '', phone: '', source: '', status: '', userId: 0 };
  editingLead: Lead | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private leadService: LeadService, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      window.location.href = '/login';
      return;
    }

    this.loadLeads();
  }

  loadLeads() {
    this.leadService.getLeads().subscribe({
      next: (data: Lead[]) => {
        this.leads = data;
        this.clearMessages();
      },
      error: (err: any) => {
        console.error('Error loading leads', err);
        this.errorMessage = 'Failed to load leads.';
      }
    });
  }

  // createLead() {
  //   if (!this.newLead.name || !this.newLead.emailAddress || !this.newLead.phone) {
  //     this.errorMessage = 'All fields are required.';
  //     return;
  //   }
  //   this.leadService.createLead(this.newLead).subscribe({
  //     next: (lead: any) => {
  //       this.leads.push(lead);
  //       const userId = this.authService.getUserId();
  //       if (typeof userId === 'number') {
  //         this.newLead.userId = userId;
  //       }
  //       this.newLead = { id: 0, name: '', emailAddress: '', phone: '', source: '', status: '', userId: 0  };
  //       this.clearMessages();
  //       this.successMessage = 'Lead created successfully.';
  //       setTimeout(() => this.clearMessages(), 3000);
  //     },
  //     error: (err: any) => {
  //       console.error('Error creating lead', err);
  //       this.errorMessage = 'Failed to create lead.';
  //     }
  //   });
  // }

  createLead() {
  const userId = this.authService.getUserId();
  if (!userId) {
    this.errorMessage = 'You must be logged in to create a lead.';
    return;
  }

  this.newLead.userId = userId; // ✅ Important
  this.leadService.createLead(this.newLead).subscribe({
    next: (lead: any) => {
      this.leads.push(lead);
      this.newLead = { id: 0, name: '', emailAddress: '', phone: '', source: '', status: '', userId: 0 };
      this.successMessage = 'Lead created successfully.';
      setTimeout(() => this.clearMessages(), 3000);
    },
    error: (err: any) => {
      console.error('Error creating lead', err);
      this.errorMessage = 'Failed to create lead.';
    }
  });
}


  editLead(lead: Lead) {
    this.editingLead = { ...lead };
    this.clearMessages();
  }

  updateLead() {
    if (this.editingLead && this.isValidLead(this.editingLead)) {
      this.leadService.updateLead(this.editingLead).subscribe({
        next: () => {
          const index = this.leads.findIndex(l => l.id === this.editingLead!.id);
          if (index !== -1) this.leads[index] = this.editingLead!;
          this.editingLead = null;
          this.successMessage = 'Lead updated successfully.';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err: any) => {
          console.error('Error updating lead', err);
          this.errorMessage = 'Failed to update lead.';
        }
      });
    }
  }

  cancelEdit() {
    this.editingLead = null;
    this.clearMessages();
  }

  deleteLead(id: number) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leadService.deleteLead(id).subscribe({
        next: () => {
          this.leads = this.leads.filter(lead => lead.id !== id);
          this.successMessage = 'Lead deleted successfully.';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err: any) => {
          console.error('Error deleting lead', err);
          this.errorMessage = 'Failed to delete lead.';
        }
      });
    }
  }

  private isValidLead(lead: Lead): boolean {
    return lead.name !== '' && lead.emailAddress !== '' && lead.phone !== '';
  }

  private clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
