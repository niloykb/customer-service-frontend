import { Customer } from '../model/customer';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CustomerService } from '../services/customer.service';
import { CustomerFormService } from '../services/customer-form.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.scss'
})
export class CustomerDialogComponent {

  isSubmitting = false;
  public data = inject<Customer>(MAT_DIALOG_DATA);
  private customerService = inject(CustomerService);
  private snackbarService = inject(SnackbarService);
  private customerFormService = inject(CustomerFormService);

  readonly dialogRef = inject(MatDialogRef<CustomerDialogComponent>);

  get email() {
    return this.customerForm.get('email');
  }

  get customerForm() {
    return this.customerFormService.customerForm;
  }

  onSubmit(): void {
    this.isSubmitting = true;
    if (this.customerForm.invalid) {
      this.isSubmitting = false;
      Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    const customerFormValue = this.customerForm.getRawValue();
    this.customerService.addCustomer(customerFormValue).subscribe({
      next: ({data}: any) => {
        this.customerForm.reset();
        this.isSubmitting = false;
        this.snackbarService.openSnackBar({
          message: `${data.name} created successfully`,
          class: 'submit-success'
        });
        this.dialogRef.close(true);
      },
      error: ({error}) => {
        this.isSubmitting = false;
        this.snackbarService.openSnackBar({
          message: error.message,
          class: 'submit-error'
        });
      }
    })
  }
}
