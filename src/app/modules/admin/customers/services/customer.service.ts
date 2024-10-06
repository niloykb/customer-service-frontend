import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Customer, CustomerResponse } from '../model/customer';
import { environment } from '../../../../../environments/environment.development';


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

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${id}`);
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
