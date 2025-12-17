import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/quote.model';
import { StorageService } from './storage.service';
import { QuoteService } from './quote.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private quoteService: QuoteService
  ) {
    this.loadOrders();
  }

  private loadOrders(): void {
    const orders = this.storageService.get<Order[]>(this.STORAGE_KEY) || [];
    this.ordersSubject.next(orders);
  }

  private saveOrders(orders: Order[]): void {
    this.storageService.set(this.STORAGE_KEY, orders);
    this.ordersSubject.next(orders);
  }

  getAll(): Order[] {
    return this.ordersSubject.value;
  }

  getById(id: string): Order | undefined {
    return this.ordersSubject.value.find(o => o.id === id);
  }

  createFromQuote(quoteId: string): Order {
    const quote = this.quoteService.getById(quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }

    if (quote.status !== 'accepted') {
      throw new Error('Quote must be accepted before creating an order');
    }

    const newOrder: Order = {
      id: this.generateId(),
      quoteId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      description: quote.description,
      lines: quote.lines,
      status: 'pending',
      subtotal: quote.subtotal,
      vatTotal: quote.vatTotal,
      total: quote.total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const orders = [...this.ordersSubject.value, newOrder];
    this.saveOrders(orders);
    return newOrder;
  }

  updateStatus(id: string, status: Order['status']): Order | undefined {
    const orders = this.ordersSubject.value;
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) return undefined;

    const updatedOrder: Order = {
      ...orders[index],
      status,
      updatedAt: new Date(),
      completedAt: status === 'completed' ? new Date() : orders[index].completedAt
    };

    orders[index] = updatedOrder;
    this.saveOrders(orders);
    return updatedOrder;
  }

  delete(id: string): boolean {
    const orders = this.ordersSubject.value;
    const filtered = orders.filter(o => o.id !== id);

    if (filtered.length === orders.length) return false;

    this.saveOrders(filtered);
    return true;
  }

  private generateId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
