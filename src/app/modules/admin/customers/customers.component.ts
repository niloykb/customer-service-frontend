import { Customer } from './model/customer';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerService } from './services/customer.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DialogService } from '../../../shared/components/dialogs/dialog.service';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { Component, ViewChild, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
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

  displayedColumns: string[] = ['index', 'id', 'name', 'type', 'email', 'city', 'state', 'address', 'postalCode', 'action'];

  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);
  customerService = inject(CustomerService);

  customers: Customer[] = [];
  dialog = inject(MatDialog);

  pageSize = 0;
  filterValue = '';
  resultsLength = 0;
  selectedPageSize = 15;
  isLoadingResults = true;

  private refresh$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private filterSubject$ = new Subject<string>();

  ngAfterViewInit() {
    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.paginator.pageIndex = 0;
    });
    
    this.loadCustomers().subscribe(data => this.customers = data);
    this.setupFilterSubscription();
  }


  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterSubject$.next(inputElement.value.trim().toLowerCase());
  }

  private setupFilterSubscription() {
    this.filterSubject$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((filterValue: string) => {
        this.filterValue = filterValue;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        console.log(this.filterValue);
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  private loadCustomers(): Observable<any[]> {
    return merge(this.sort.sortChange, this.paginator.page, this.refresh$).pipe(
      takeUntil(this.destroy$),
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.customerService.getCustomerCollection(
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
      })
    );
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
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.refresh$.next();
      }
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
      if (response) {
        this.openCustomerModal(customer);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

