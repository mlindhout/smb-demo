import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, CreateCustomerDto } from '../models/customer.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'customers';
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    const customers = this.storageService.get<Customer[]>(this.STORAGE_KEY) || [];
    this.customersSubject.next(customers);
  }

  private saveCustomers(customers: Customer[]): void {
    this.storageService.set(this.STORAGE_KEY, customers);
    this.customersSubject.next(customers);
  }

  getAll(): Customer[] {
    return this.customersSubject.value;
  }

  getById(id: string): Customer | undefined {
    return this.customersSubject.value.find(c => c.id === id);
  }

  create(dto: CreateCustomerDto): Customer {
    const newCustomer: Customer = {
      id: this.generateId(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const customers = [...this.customersSubject.value, newCustomer];
    this.saveCustomers(customers);
    return newCustomer;
  }

  update(id: string, dto: Partial<CreateCustomerDto>): Customer | undefined {
    const customers = this.customersSubject.value;
    const index = customers.findIndex(c => c.id === id);

    if (index === -1) return undefined;

    const updatedCustomer: Customer = {
      ...customers[index],
      ...dto,
      updatedAt: new Date()
    };

    customers[index] = updatedCustomer;
    this.saveCustomers(customers);
    return updatedCustomer;
  }

  delete(id: string): boolean {
    const customers = this.customersSubject.value;
    const filtered = customers.filter(c => c.id !== id);

    if (filtered.length === customers.length) return false;

    this.saveCustomers(filtered);
    return true;
  }

  private generateId(): string {
    return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
