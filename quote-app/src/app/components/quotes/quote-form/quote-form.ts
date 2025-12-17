import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteService } from '../../../services/quote.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CreateQuoteDto, QuoteLine } from '../../../models/quote.model';

interface QuoteLineForm {
  quantity: number;
  description: string;
  unitPrice: number;
  vatPercentage: number;
}

@Component({
  selector: 'app-quote-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.css',
})
export class QuoteForm implements OnInit {
  quoteId: string | null = null;
  isEditMode = false;
  customers: Customer[] = [];

  formData = {
    customerId: '',
    description: ''
  };

  lines: QuoteLineForm[] = [
    { quantity: 1, description: '', unitPrice: 0, vatPercentage: 21 }
  ];

  constructor(
    private quoteService: QuoteService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.quoteId = this.route.snapshot.paramMap.get('id');

    if (this.quoteId) {
      this.isEditMode = true;
      const quote = this.quoteService.getById(this.quoteId);
      if (quote) {
        this.formData = {
          customerId: quote.customerId,
          description: quote.description
        };
        this.lines = quote.lines.map(line => ({
          quantity: line.quantity,
          description: line.description,
          unitPrice: line.unitPrice,
          vatPercentage: line.vatPercentage
        }));
      }
    }
  }

  loadCustomers(): void {
    this.customerService.customers$.subscribe(customers => {
      this.customers = customers;
    });
  }

  addLine(): void {
    this.lines.push({ quantity: 1, description: '', unitPrice: 0, vatPercentage: 21 });
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.splice(index, 1);
    }
  }

  calculateLineTotal(line: QuoteLineForm): number {
    const subtotal = line.quantity * line.unitPrice;
    const vat = subtotal * (line.vatPercentage / 100);
    return subtotal + vat;
  }

  calculateSubtotal(): number {
    return this.lines.reduce((sum, line) => {
      return sum + (line.quantity * line.unitPrice);
    }, 0);
  }

  calculateVatTotal(): number {
    return this.lines.reduce((sum, line) => {
      const subtotal = line.quantity * line.unitPrice;
      return sum + (subtotal * (line.vatPercentage / 100));
    }, 0);
  }

  calculateGrandTotal(): number {
    return this.calculateSubtotal() + this.calculateVatTotal();
  }

  onSubmit(): void {
    if (!this.formData.customerId || !this.formData.description) {
      alert('Vul alle verplichte velden in');
      return;
    }

    if (this.lines.length === 0 || this.lines.some(l => !l.description || l.quantity <= 0 || l.unitPrice < 0)) {
      alert('Vul alle regelgegevens correct in');
      return;
    }

    const dto: CreateQuoteDto = {
      customerId: this.formData.customerId,
      description: this.formData.description,
      lines: this.lines.map(line => ({
        quantity: line.quantity,
        description: line.description,
        unitPrice: line.unitPrice,
        vatPercentage: line.vatPercentage
      }))
    };

    if (this.isEditMode && this.quoteId) {
      this.quoteService.update(this.quoteId, dto);
      alert('Offerte succesvol bijgewerkt!');
    } else {
      this.quoteService.create(dto);
      alert('Offerte succesvol aangemaakt!');
    }
    this.router.navigate(['/quotes']);
  }

  goBack(): void {
    this.router.navigate(['/quotes']);
  }
}
