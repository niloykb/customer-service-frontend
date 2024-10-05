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

  customerService = inject(CustomerService);
  customers: Customer[] = [];

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.customers = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
