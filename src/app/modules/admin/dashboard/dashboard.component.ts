import { Customer } from '../customers/model/customer';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerService } from '../customers/services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  customerService = inject(CustomerService);
  customers: Customer[] = [];

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.customers = response.data;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    })
  }
}
