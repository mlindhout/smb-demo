import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { InvoiceService } from '../../../services/invoice.service';
import { Order } from '../../../models/quote.model';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders;
    });
  }

  markAsCompleted(orderId: string): void {
    if (confirm('Weet je zeker dat je deze order als voltooid wilt markeren?')) {
      this.orderService.updateStatus(orderId, 'completed');
      alert('Order succesvol voltooid!');
    }
  }

  createInvoice(orderId: string): void {
    const order = this.orderService.getById(orderId);
    if (!order) return;

    if (order.status !== 'completed') {
      alert('Order moet eerst als voltooid worden gemarkeerd!');
      return;
    }

    if (confirm('Weet je zeker dat je een factuur wilt aanmaken voor deze order?')) {
      try {
        this.invoiceService.createFromOrder(orderId);
        alert('Factuur succesvol aangemaakt!');
        this.router.navigate(['/invoices']);
      } catch (error) {
        alert('Fout bij het aanmaken van de factuur');
      }
    }
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status];
  }

  getStatusLabel(status: Order['status']): string {
    const labels = {
      pending: 'In afwachting',
      in_progress: 'In uitvoering',
      completed: 'Voltooid'
    };
    return labels[status];
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
