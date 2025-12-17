import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../services/quote.service';
import { Quote } from '../../../models/quote.model';

@Component({
  selector: 'app-quote-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.css',
})
export class QuoteList implements OnInit {
  quotes: Quote[] = [];

  constructor(
    private quoteService: QuoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteService.quotes$.subscribe(quotes => {
      this.quotes = quotes;
    });
  }

  deleteQuote(id: string): void {
    if (confirm('Weet je zeker dat je deze offerte wilt verwijderen?')) {
      this.quoteService.delete(id);
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

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
