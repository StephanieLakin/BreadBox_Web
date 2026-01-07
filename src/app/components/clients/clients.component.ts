import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: false,
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  newClient: Client = { id: 0, name: '', emailAddress: '', phone: '', address: '', createdAt: '', userId: 1 }; // adjust userId as needed
  editingClient: Client | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private clientService: ClientService, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      window.location.href = '/login';
      return;
    }
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.clearMessages();
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.errorMessage = 'Failed to load clients.';
      }
    });
  }

  createClient() {
    if (!this.isValidClient(this.newClient)) {
      this.errorMessage = 'Name and Email are required.';
      return;
    }

    this.clientService.createClient(this.newClient).subscribe({
      next: (client) => {
        this.clients.push(client);
        this.newClient = { id: 0, name: '', emailAddress: '', phone: '', address: '', createdAt: '', userId: 1 };
        this.successMessage = 'Client created successfully.';
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (err) => {
        console.error('Error creating client', err);
        this.errorMessage = 'Failed to create client.';
      }
    });
  }

  editClient(client: Client) {
    this.editingClient = { ...client };
    this.clearMessages();
  }

  updateClient() {
    if (this.editingClient && this.isValidClient(this.editingClient)) {
      const updatedClient: Client = { ...this.editingClient };
      this.clientService.updateClient(updatedClient).subscribe({
        next: () => {
          const index = this.clients.findIndex(c => c.id === updatedClient.id);
          if (index !== -1) this.clients[index] = updatedClient;
          this.editingClient = null;
          this.successMessage = 'Client updated successfully.';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err) => {
          console.error('Error updating client', err);
          this.errorMessage = 'Failed to update client.';
        }
      });
    }
  }

  cancelEdit() {
    this.editingClient = null;
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.clients = this.clients.filter(client => client.id !== id);
          this.successMessage = 'Client deleted successfully.';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err) => {
          console.error('Error deleting client', err);
          this.errorMessage = 'Failed to delete client.';
        }
      });
    }
  }

  private isValidClient(client: Client): boolean {
    return !!client.name && !!client.emailAddress;
  }

  private clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
