import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
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

export interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: any;
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface CustomerResponse {
  data: Customer[];
  links: Links;
  meta: Meta;
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

  getCustomerCollection(
    sort: string, 
    order: SortDirection, 
    page: number, 
    pageSize: number, 
    filterValue: string
  ): Observable<CustomerResponse> {

    const requestUrl = `${this.apiUrl}/customers?sort=${sort}&order=${order}&page=${page + 1}&page_size=${pageSize}&filter_value=${filterValue}`;
    
    return this.http.get<CustomerResponse>(requestUrl);
  }
  
}
