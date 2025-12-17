export interface QuoteLine {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
  vatPercentage: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  lines: QuoteLine[];
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  subtotal: number;
  vatTotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuoteDto {
  customerId: string;
  description: string;
  lines: Omit<QuoteLine, 'id' | 'lineTotal'>[];
}

export interface Order {
  id: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  description: string;
  lines: QuoteLine[];
  status: 'pending' | 'in_progress' | 'completed';
  subtotal: number;
  vatTotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  description: string;
  lines: QuoteLine[];
  subtotal: number;
  vatTotal: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
}
