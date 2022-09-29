import { Component } from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';

import {BaseComponent} from '@isbit/render/core/components';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import * as models from './models';

@Component({
  selector: 'isbit-create-database',
  templateUrl: './create-database.component.html',
  styleUrls: ['./create-database.component.scss']
})
export class CreateDatabaseComponent extends BaseComponent{

  public createDatabaseForm: FormGroup;

  public createDatabaseFormFields: typeof models.CreateDatabaseFormFields = models.CreateDatabaseFormFields;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: DialogRef
  ) {
    super();

    dialogRef.disableClose = true;

    this.onInit.subscribe(() => this.createForm());
  }

  public createDatabase(): void {
    if (this.createDatabaseForm.invalid) {
      alert('Invalid form data');
      return;
    }

    this.dialogRef.close(this.createDatabaseForm.getRawValue());
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

  public setDatabaseFolder($event: string[]) {
    this.createDatabaseForm.patchValue({
      location: $event[0]
    });
  }

  private createForm(): void {
    this.createDatabaseForm = this.formBuilder.group({
      location: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      privateKey: new FormControl(null, Validators.required),
    });
  }
}
