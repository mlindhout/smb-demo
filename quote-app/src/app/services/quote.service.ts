import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quote, QuoteLine, CreateQuoteDto } from '../models/quote.model';
import { StorageService } from './storage.service';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly STORAGE_KEY = 'quotes';
  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public quotes$ = this.quotesSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private customerService: CustomerService
  ) {
    this.loadQuotes();
  }

  private loadQuotes(): void {
    const quotes = this.storageService.get<Quote[]>(this.STORAGE_KEY) || [];
    this.quotesSubject.next(quotes);
  }

  private saveQuotes(quotes: Quote[]): void {
    this.storageService.set(this.STORAGE_KEY, quotes);
    this.quotesSubject.next(quotes);
  }

  getAll(): Quote[] {
    return this.quotesSubject.value;
  }

  getById(id: string): Quote | undefined {
    return this.quotesSubject.value.find(q => q.id === id);
  }

  getByCustomerId(customerId: string): Quote[] {
    return this.quotesSubject.value.filter(q => q.customerId === customerId);
  }

  create(dto: CreateQuoteDto): Quote {
    const customer = this.customerService.getById(dto.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const lines = this.processQuoteLines(dto.lines);
    const { subtotal, vatTotal, total } = this.calculateTotals(lines);

    const newQuote: Quote = {
      id: this.generateId(),
      customerId: dto.customerId,
      customerName: customer.name,
      description: dto.description,
      lines,
      status: 'draft',
      subtotal,
      vatTotal,
      total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const quotes = [...this.quotesSubject.value, newQuote];
    this.saveQuotes(quotes);
    return newQuote;
  }

  update(id: string, dto: Partial<CreateQuoteDto>): Quote | undefined {
    const quotes = this.quotesSubject.value;
    const index = quotes.findIndex(q => q.id === id);

    if (index === -1) return undefined;

    const existingQuote = quotes[index];
    const lines = dto.lines ? this.processQuoteLines(dto.lines) : existingQuote.lines;
    const { subtotal, vatTotal, total } = this.calculateTotals(lines);

    const updatedQuote: Quote = {
      ...existingQuote,
      ...dto,
      lines,
      subtotal,
      vatTotal,
      total,
      updatedAt: new Date()
    };

    quotes[index] = updatedQuote;
    this.saveQuotes(quotes);
    return updatedQuote;
  }

  updateStatus(id: string, status: Quote['status']): Quote | undefined {
    const quotes = this.quotesSubject.value;
    const index = quotes.findIndex(q => q.id === id);

    if (index === -1) return undefined;

    const updatedQuote: Quote = {
      ...quotes[index],
      status,
      updatedAt: new Date()
    };

    quotes[index] = updatedQuote;
    this.saveQuotes(quotes);
    return updatedQuote;
  }

  delete(id: string): boolean {
    const quotes = this.quotesSubject.value;
    const filtered = quotes.filter(q => q.id !== id);

    if (filtered.length === quotes.length) return false;

    this.saveQuotes(filtered);
    return true;
  }

  private processQuoteLines(lines: Omit<QuoteLine, 'id' | 'lineTotal'>[]): QuoteLine[] {
    return lines.map(line => ({
      id: this.generateId(),
      ...line,
      lineTotal: this.calculateLineTotal(line.quantity, line.unitPrice, line.vatPercentage)
    }));
  }

  private calculateLineTotal(quantity: number, unitPrice: number, vatPercentage: number): number {
    const subtotal = quantity * unitPrice;
    const vat = subtotal * (vatPercentage / 100);
    return subtotal + vat;
  }

  private calculateTotals(lines: QuoteLine[]): { subtotal: number; vatTotal: number; total: number } {
    let subtotal = 0;
    let vatTotal = 0;

    lines.forEach(line => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineVat = lineSubtotal * (line.vatPercentage / 100);
      subtotal += lineSubtotal;
      vatTotal += lineVat;
    });

    return {
      subtotal,
      vatTotal,
      total: subtotal + vatTotal
    };
  }

  private generateId(): string {
    return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
