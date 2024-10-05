import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {

  formBuilder = inject(FormBuilder);

  customerForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    type: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
  })

}
