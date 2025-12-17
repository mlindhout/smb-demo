export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  name: string;
  address: string;
  city: string;
  email: string;
  phoneNumber: string;
}
