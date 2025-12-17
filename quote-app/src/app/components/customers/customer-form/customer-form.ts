import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { CreateCustomerDto } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm implements OnInit {
  customerId: string | null = null;
  isEditMode = false;

  formData: CreateCustomerDto = {
    name: '',
    address: '',
    city: '',
    email: '',
    phoneNumber: ''
  };

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');

    if (this.customerId) {
      this.isEditMode = true;
      const customer = this.customerService.getById(this.customerId);
      if (customer) {
        this.formData = {
          name: customer.name,
          address: customer.address,
          city: customer.city,
          email: customer.email,
          phoneNumber: customer.phoneNumber
        };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.customerId) {
      this.customerService.update(this.customerId, this.formData);
    } else {
      this.customerService.create(this.formData);
    }
    this.router.navigate(['/customers']);
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
