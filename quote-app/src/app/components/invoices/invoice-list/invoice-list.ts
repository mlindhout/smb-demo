import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../services/invoice.service';
import { CustomerService } from '../../../services/customer.service';
import { EmailService } from '../../../services/email.service';
import { Invoice } from '../../../models/quote.model';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceList implements OnInit {
  invoices: Invoice[] = [];
  sendingEmailForId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.invoices$.subscribe(invoices => {
      this.invoices = invoices;
    });
  }

  async sendInvoice(invoiceId: string): Promise<void> {
    const invoice = this.invoiceService.getById(invoiceId);
    if (!invoice) return;

    const customer = this.customerService.getById(invoice.customerId);
    if (!customer) {
      alert('Klantgegevens niet gevonden');
      return;
    }

    if (confirm(`Factuur verzenden naar ${customer.email}?`)) {
      this.sendingEmailForId = invoiceId;
      try {
        const success = await this.emailService.sendInvoice(invoice, customer.email);
        if (success) {
          this.invoiceService.updateStatus(invoiceId, 'sent');
          alert('Factuur succesvol verzonden!');
        }
      } catch (error) {
        alert('Fout bij het verzenden van de factuur');
      } finally {
        this.sendingEmailForId = null;
      }
    }
  }

  markAsPaid(invoiceId: string): void {
    if (confirm('Weet je zeker dat je deze factuur als betaald wilt markeren?')) {
      this.invoiceService.updateStatus(invoiceId, 'paid');
      alert('Factuur gemarkeerd als betaald!');
    }
  }

  getStatusColor(status: Invoice['status']): string {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status];
  }

  getStatusLabel(status: Invoice['status']): string {
    const labels = {
      draft: 'Concept',
      sent: 'Verzonden',
      paid: 'Betaald',
      overdue: 'Verlopen'
    };
    return labels[status];
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.status === 'paid') return false;
    return new Date(invoice.dueDate) < new Date();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
