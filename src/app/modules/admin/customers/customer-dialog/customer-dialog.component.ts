import { Customer } from '../model/customer';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CustomerFormService } from '../services/customer-form.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { FormValidationService } from '../../../../shared/validations/form-validation.service';


@Component({
    selector: 'app-customer-dialog',
    imports: [SharedModule, ReactiveFormsModule],
    templateUrl: './customer-dialog.component.html',
    styleUrl: './customer-dialog.component.scss'
})
export class CustomerDialogComponent {

  modalTitle: string;
  isSubmitting = false;
  isUpdateOperation: boolean;

  constructor() {
    this.isUpdateOperation = !!this.data;
    this.modalTitle = this.isUpdateOperation ? `Update <strong>${this.data.name}'s</strong> Info.` : 'Create a New Customer';

    if (this.isUpdateOperation) {
      this.customerFormService.populateForm(this.data);
    }
  }

  public data = inject<Customer>(MAT_DIALOG_DATA);
  private customerService = inject(CustomerService);
  private snackbarService = inject(SnackbarService);
  private customerFormService = inject(CustomerFormService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<CustomerDialogComponent>);

  get customerForm() {
    return this.customerFormService.customerForm;
  }

  get email() {
    return this.customerForm.get('email');
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.isSubmitting = false;
      return this.formValidationService.validationMessage(this.customerForm);
    }

    this.isSubmitting = true;
    const customerFormValue = this.customerForm.getRawValue();

    const operation = this.isUpdateOperation
      ? this.customerService.updateCustomer(customerFormValue)
      : this.customerService.createCustomer(customerFormValue);

    operation.subscribe({
      next: ({ data }: any) => {
        this.isSubmitting = false;
        const action = this.isUpdateOperation ? 'updated' : 'created';
        this.customerForm.reset();
        this.snackbarService.openSnackBar({
          message: `${data.name} ${action} successfully`,
          class: 'success'
        });
        this.dialogRef.close(true);
      },
      error: ({ error }) => {
        this.isSubmitting = false;
        this.snackbarService.openSnackBar({
          message: error.message,
          class: 'error'
        });
      }
    })
  }

  onCloseModal() {
    this.dialogRef.close(false);
    this.customerForm.reset();
  }
}
