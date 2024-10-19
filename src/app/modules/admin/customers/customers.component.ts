import { Customer } from './model/customer';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, merge, of, Subject } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerService } from './services/customer.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DialogService } from '../../../shared/components/dialogs/dialog.service';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { Component, ViewChild, AfterViewInit, inject, OnDestroy, ElementRef } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, skip, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
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
export class CustomersComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filterInput') filterInput!: ElementRef;

  displayedColumns: string[] = ['index', 'id', 'name', 'type', 'email', 'city', 'state', 'address', 'postalCode', 'action'];

  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);
  customerService = inject(CustomerService);

  customers: Customer[] = [];
  dialog = inject(MatDialog);

  pageSize = 0;
  resultsLength = 0;
  selectedPageSize = 15;
  isLoadingResults = true;

  private destroy$ = new Subject<void>();
  private refresh$ = new Subject<void>();

  private filterSubject = new BehaviorSubject<string>('');

  ngAfterViewInit() {
    this.loadCustomers();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  applyFilter(filterInput: string) {
    this.paginator.firstPage();
    this.filterSubject.next(filterInput.trim().toLowerCase());
  }

  private loadCustomers() {
    merge(
      this.refresh$,
      this.paginator.page,
      this.sort.sortChange,
      this.filterSubject.pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged()
      )
    ).pipe(
      takeUntil(this.destroy$),
      startWith({}),
      tap(() => this.isLoadingResults = true),
      switchMap(() => {
        return this.customerService.getCustomerCollection(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.filterSubject.getValue()
        ).pipe(
          catchError(error => {
            console.error('Error occurred:', error);
            this.isLoadingResults = false;
            return of(null);
          }),
          map(({ data, meta }: any) => {
            this.isLoadingResults = false;
            if (!data) return [];
            this.pageSize = meta.per_page;
            this.resultsLength = meta.total;
            return data;
          })
        );
      })
    ).subscribe(data => this.customers = data);
  }

  onDeleteCustomer(customer: Customer) {
    this.dialogService.confirmDialog({
      title: 'Delete Customer',
      message: `Are you sure you want to delete <strong>${customer.name}</strong>?`,
      cancelText: 'No',
      submitText: 'Yes',
    }).subscribe((response) => {
      if (response) {
        this.customerService.deleteCustomer(Number(customer.id)).subscribe(() => {
          this.refresh$.next();
          this.snackbarService.openSnackBar({
            message: `${customer.name} deleted successfully`,
            class: 'success'
          });
        });
      }
    });
  }

  openCustomerModal(customer?: Customer) {
    this.dialog.open(CustomerDialogComponent, {
      width: '600px',
      data: customer || null,
      disableClose: true,
    }).afterClosed()
      .subscribe((result: boolean) => {
        if (result) this.refresh$.next();
      });
  }

  openCreateCustomerModal() {
    this.openCustomerModal();
  }

  openUpdateCustomerModal(customer: Customer) {
    this.dialogService.confirmDialog({
      title: 'Update Customer',
      message: `Are you sure you want to update <strong>${customer.name}</strong>?`,
      cancelText: 'No',
      submitText: 'Yes',
    }).subscribe((response) => {
      if (response) this.openCustomerModal(customer);
    });
  }

  onClearSearch() {
    this.filterSubject.next('');
    this.filterInput.nativeElement.value = '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

