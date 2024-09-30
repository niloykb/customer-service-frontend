import { merge, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Customer, CustomerService } from '../../../services/customer.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  standalone: true,
  imports: [
    MatIcon,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ]
})
export class CustomersComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'type', 'email', 'city', 'state', 'address', 'postalCode', 'action'];

  customerService = inject(CustomerService);
  customers: Customer[] = [];

  pageSize = 0;
  filterValue = '';
  resultsLength = 0;
  selectedPageSize = 15;
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
          return this.customerService?.getCustomerCollection(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.filterValue
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (!data) return [];

          this.pageSize = data.meta.per_page;
          this.resultsLength = data.meta.total;
          return data.data;
        }),
      )
      .subscribe(data => (this.customers = data));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.filterValue = filterValue.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.sort.sortChange.emit();
  }
}

