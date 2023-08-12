import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-customer-entry',
  templateUrl: './customer-entry.component.html',
  styleUrls: ['./customer-entry.component.scss'],
})
export class CustomerEntryComponent {
  customerForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customerService: CustomerService,
    formBuilder: FormBuilder,
    private _dialogRef: DialogRef<CustomerEntryComponent>
  ) {
    this.customerForm = formBuilder.group({
      firstName: '',
      lastName: '',
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.customerForm.patchValue({
        firstName: this.data.firstName,
        lastName: this.data.lastName,
      });
    }
  }

  get isEdit(): boolean {
    return this.data.display.isEdit;
  }

  onSave() {
    if (this.customerForm.valid) {
      if (this.data && this.data.id) {
        // Update
        this._customerService
          .updateCustomer({
            id: this.data.id,
            firstName: this.customerForm.value.firstName,
            lastName: this.customerForm.value.lastName,
          })
          .subscribe(() => {
            this._dialogRef.close();
          });
      } else {
        // Create
        this._customerService
          .addCustomer({
            firstName: this.customerForm.value.firstName,
            lastName: this.customerForm.value.lastName,
          })
          .subscribe(() => {
            this._dialogRef.close();
          });
      }
    }
  }
}
