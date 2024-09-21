import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
export interface Customer {
  id: number;
  name: string;
  type: string;
  email: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
