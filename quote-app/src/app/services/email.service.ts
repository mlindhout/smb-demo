import { Injectable } from '@angular/core';
import { Quote, Invoice } from '../models/quote.model';

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
  type: 'quote' | 'invoice';
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailLogs: EmailLog[] = [];

  sendQuote(quote: Quote, customerEmail: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email: EmailLog = {
          id: this.generateId(),
          to: customerEmail,
          subject: `Offerte: ${quote.description}`,
          body: this.generateQuoteEmailBody(quote),
          sentAt: new Date(),
          type: 'quote'
        };

        this.emailLogs.push(email);
        console.log('📧 Email verzonden (mock):', email);
        resolve(true);
      }, 500);
    });
  }

  sendInvoice(invoice: Invoice, customerEmail: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email: EmailLog = {
          id: this.generateId(),
          to: customerEmail,
          subject: `Factuur ${invoice.invoiceNumber}: ${invoice.description}`,
          body: this.generateInvoiceEmailBody(invoice),
          sentAt: new Date(),
          type: 'invoice'
        };

        this.emailLogs.push(email);
        console.log('📧 Email verzonden (mock):', email);
        resolve(true);
      }, 500);
    });
  }

  getEmailLogs(): EmailLog[] {
    return [...this.emailLogs];
  }

  private generateQuoteEmailBody(quote: Quote): string {
    return `
Beste ${quote.customerName},

Hierbij ontvangt u onze offerte voor: ${quote.description}

Offerte Details:
${quote.lines.map(line =>
  `- ${line.quantity}x ${line.description}: €${line.unitPrice.toFixed(2)} (BTW: ${line.vatPercentage}%)`
).join('\n')}

Subtotaal: €${quote.subtotal.toFixed(2)}
BTW: €${quote.vatTotal.toFixed(2)}
Totaal: €${quote.total.toFixed(2)}

Met vriendelijke groet,
Uw Bedrijf
    `.trim();
  }

  private generateInvoiceEmailBody(invoice: Invoice): string {
    return `
Beste ${invoice.customerName},

Hierbij ontvangt u factuur ${invoice.invoiceNumber} voor: ${invoice.description}

Factuur Details:
${invoice.lines.map(line =>
  `- ${line.quantity}x ${line.description}: €${line.unitPrice.toFixed(2)} (BTW: ${line.vatPercentage}%)`
).join('\n')}

Subtotaal: €${invoice.subtotal.toFixed(2)}
BTW: €${invoice.vatTotal.toFixed(2)}
Totaal: €${invoice.total.toFixed(2)}

Vervaldatum: ${invoice.dueDate.toLocaleDateString('nl-NL')}

Gelieve het bedrag voor de vervaldatum over te maken.

Met vriendelijke groet,
Uw Bedrijf
    `.trim();
  }

  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
