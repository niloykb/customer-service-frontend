import { fromEvent, merge, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Customer, CustomerService } from '../../../services/customer.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { DialogService } from '../../../shared/services/dialog.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  standalone: true,
  imports: [
    MatIcon,
    SharedModule,
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

  dialogService = inject(DialogService);
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
    const inputElement = event.target as HTMLInputElement;

    fromEvent(inputElement, 'input')
      .pipe(
        debounceTime(500),
        map((e: Event) => inputElement.value.trim().toLowerCase())
      )
      .subscribe((filterValue: string) => {
        this.filterValue = filterValue;

        if (this.paginator) {
          this.paginator.firstPage();
        }

        this.sort.sortChange.emit();
      });
  }

  onDeleteCustomer(customer: Customer) {
    this.dialogService.confirmDialog({
      title: 'Confirm Action',
      message: `Are you sure you want to delete <b>${customer.name}</b>?`,
      cancelText: 'No',
      confirmText: 'Yes',
    }).subscribe((response) => {
      if (response) {
        console.log('The user said YES');
      }
    });
  }

}

