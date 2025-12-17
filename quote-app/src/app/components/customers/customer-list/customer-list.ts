import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {
  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.customers$.subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomer(id: string): void {
    if (confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
      this.customerService.delete(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
