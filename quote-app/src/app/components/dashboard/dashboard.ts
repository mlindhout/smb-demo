import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { QuoteService } from '../../services/quote.service';
import { OrderService } from '../../services/order.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  customerCount = 0;
  quoteCount = 0;
  orderCount = 0;
  invoiceCount = 0;
  userName = '';

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private quoteService: QuoteService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }

    this.updateStats();
  }

  updateStats(): void {
    this.customerCount = this.customerService.getAll().length;
    this.quoteCount = this.quoteService.getAll().length;
    this.orderCount = this.orderService.getAll().length;
    this.invoiceCount = this.invoiceService.getAll().length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
