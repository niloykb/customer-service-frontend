import { Customer } from '../model/customer';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {

  formBuilder = inject(FormBuilder);

  customerForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    type: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
  })

  populateForm(customer: Customer): void {
    const customerType = (customer.type).toLocaleLowerCase();
    this.customerForm.patchValue({
      id: customer.id,
      name: customer.name,
      type: customerType,
      email: customer.email,
      city: customer.city,
      state: customer.state,
      address: customer.address,
      postalCode: customer.postalCode,
    })
  }

}
