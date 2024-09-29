import { DatePipe } from '@angular/common';
import { merge, of as observableOf } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Customer, CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class CustomersComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'type', 'email', 'city', 'state', 'address', 'postalCode'];

  customerService = inject(CustomerService);
  customers: Customer[] = [];

  pageSize = 0;
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.customerService!.getCustomerCollection(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.pageSize = data.meta.per_page;
          this.resultsLength = data.meta.total;
          return data.data;
        }),
      )
      .subscribe(data => (this.customers = data));
  }
}

