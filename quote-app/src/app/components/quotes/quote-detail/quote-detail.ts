import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../../../services/quote.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';
import { EmailService } from '../../../services/email.service';
import { Quote } from '../../../models/quote.model';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-quote-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './quote-detail.html',
  styleUrl: './quote-detail.css',
})
export class QuoteDetail implements OnInit {
  quote: Quote | null = null;
  customer: Customer | null = null;
  isSendingEmail = false;

  constructor(
    private quoteService: QuoteService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuote(id);
    }
  }

  loadQuote(id: string): void {
    this.quote = this.quoteService.getById(id) ?? null;
    if (this.quote) {
      this.customer = this.customerService.getById(this.quote.customerId) ?? null;
    }
  }

  getStatusColor(status: Quote['status']): string {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  }

  getStatusLabel(status: Quote['status']): string {
    const labels = {
      draft: 'Concept',
      sent: 'Verzonden',
      accepted: 'Geaccepteerd',
      rejected: 'Afgewezen'
    };
    return labels[status];
  }

  async sendQuote(): Promise<void> {
    if (!this.quote || !this.customer) return;

    if (confirm(`Offerte verzenden naar ${this.customer.email}?`)) {
      this.isSendingEmail = true;
      try {
        const success = await this.emailService.sendQuote(this.quote, this.customer.email);
        if (success) {
          this.quoteService.updateStatus(this.quote.id, 'sent');
          this.loadQuote(this.quote.id);
          alert('Offerte succesvol verzonden!');
        }
      } catch (error) {
        alert('Fout bij het verzenden van de offerte');
      } finally {
        this.isSendingEmail = false;
      }
    }
  }

  acceptQuote(): void {
    if (!this.quote) return;

    if (confirm('Weet je zeker dat je deze offerte wilt accepteren? Er wordt een order aangemaakt.')) {
      this.quoteService.updateStatus(this.quote.id, 'accepted');
      const order = this.orderService.createFromQuote(this.quote.id);
      alert('Offerte geaccepteerd en order aangemaakt!');
      this.router.navigate(['/orders']);
    }
  }

  editQuote(): void {
    if (!this.quote) return;
    this.router.navigate(['/quotes', 'edit', this.quote.id]);
  }

  deleteQuote(): void {
    if (!this.quote) return;

    if (confirm('Weet je zeker dat je deze offerte wilt verwijderen?')) {
      this.quoteService.delete(this.quote.id);
      alert('Offerte succesvol verwijderd!');
      this.router.navigate(['/quotes']);
    }
  }

  goBack(): void {
    this.router.navigate(['/quotes']);
  }
}
