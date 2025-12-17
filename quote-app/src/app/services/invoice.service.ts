import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from '../models/quote.model';
import { StorageService } from './storage.service';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly STORAGE_KEY = 'invoices';
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$ = this.invoicesSubject.asObservable();
  private invoiceCounter = 1;

  constructor(
    private storageService: StorageService,
    private orderService: OrderService
  ) {
    this.loadInvoices();
    this.initializeCounter();
  }

  private loadInvoices(): void {
    const invoices = this.storageService.get<Invoice[]>(this.STORAGE_KEY) || [];
    this.invoicesSubject.next(invoices);
  }

  private saveInvoices(invoices: Invoice[]): void {
    this.storageService.set(this.STORAGE_KEY, invoices);
    this.invoicesSubject.next(invoices);
  }

  private initializeCounter(): void {
    const counter = this.storageService.get<number>('invoice_counter');
    if (counter) {
      this.invoiceCounter = counter;
    }
  }

  private saveCounter(): void {
    this.storageService.set('invoice_counter', this.invoiceCounter);
  }

  getAll(): Invoice[] {
    return this.invoicesSubject.value;
  }

  getById(id: string): Invoice | undefined {
    return this.invoicesSubject.value.find(i => i.id === id);
  }

  createFromOrder(orderId: string): Invoice {
    const order = this.orderService.getById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'completed') {
      throw new Error('Order must be completed before creating an invoice');
    }

    const invoiceNumber = this.generateInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const newInvoice: Invoice = {
      id: this.generateId(),
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      invoiceNumber,
      description: order.description,
      lines: order.lines,
      subtotal: order.subtotal,
      vatTotal: order.vatTotal,
      total: order.total,
      status: 'draft',
      createdAt: new Date(),
      dueDate
    };

    const invoices = [...this.invoicesSubject.value, newInvoice];
    this.saveInvoices(invoices);
    return newInvoice;
  }

  updateStatus(id: string, status: Invoice['status']): Invoice | undefined {
    const invoices = this.invoicesSubject.value;
    const index = invoices.findIndex(i => i.id === id);

    if (index === -1) return undefined;

    const updatedInvoice: Invoice = {
      ...invoices[index],
      status,
      paidAt: status === 'paid' ? new Date() : invoices[index].paidAt
    };

    invoices[index] = updatedInvoice;
    this.saveInvoices(invoices);
    return updatedInvoice;
  }

  delete(id: string): boolean {
    const invoices = this.invoicesSubject.value;
    const filtered = invoices.filter(i => i.id !== id);

    if (filtered.length === invoices.length) return false;

    this.saveInvoices(filtered);
    return true;
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const number = String(this.invoiceCounter).padStart(4, '0');
    this.invoiceCounter++;
    this.saveCounter();
    return `INV-${year}-${number}`;
  }

  private generateId(): string {
    return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
