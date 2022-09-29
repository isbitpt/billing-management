import { Component } from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';

import {BaseComponent} from '@isbit/render/core/components';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import * as models from './models';

@Component({
  selector: 'isbit-select-database',
  templateUrl: './select-database.component.html',
  styleUrls: ['./select-database.component.scss']
})
export class SelectDatabaseComponent extends BaseComponent{

  public selectDatabaseForm: FormGroup;

  public selectDatabaseFormFields: typeof models.SelectDatabaseFormFields = models.SelectDatabaseFormFields;

  public fileFilters = [{
    name: 'Databases',
    extensions: ['sqlite']
  }];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: DialogRef
  ) {
    super();

    dialogRef.disableClose = true;

    this.onInit.subscribe(() => this.createForm());
  }

  public selectDatabase(): void {
    if (this.selectDatabaseForm.invalid) {
      alert('Invalid form data');
      return;
    }

    this.dialogRef.close(this.selectDatabaseForm.getRawValue());
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

  public setDatabaseFile($event: string[]) {
    this.selectDatabaseForm.patchValue({
      location: $event[0]
    });
  }

  private createForm(): void {
    this.selectDatabaseForm = this.formBuilder.group({
      location: new FormControl(null, Validators.required),
      privateKey: new FormControl(null, Validators.required),
    });
  }
}
