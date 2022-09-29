import {Component, Inject} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';

import {BaseComponent} from '@isbit/render/core/components';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import * as models from './models';

@Component({
  selector: 'isbit-remove-database',
  templateUrl: './remove-database.component.html',
  styleUrls: ['./remove-database.component.scss']
})
export class RemoveDatabaseComponent extends BaseComponent{

  public removeDatabaseForm: FormGroup;

  public removeDatabaseFormFields: typeof models.RemoveDatabaseFormFields = models.RemoveDatabaseFormFields;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: models.RemoveDatabaseDialogDataModel
  ) {
    super();

    dialogRef.disableClose = true;

    this.onInit.subscribe(() => this.createForm());
  }

  public removeDatabase(): void {
    if (this.removeDatabaseForm.get(this.removeDatabaseFormFields.confirmation).invalid) {
      alert('Must confirm database removal');
      return;
    }

    if (this.removeDatabaseForm.invalid) {
      alert('Invalid form data');
      return;
    }

    this.dialogRef.close(this.removeDatabaseForm.getRawValue());
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

  private createForm(): void {
    this.removeDatabaseForm = this.formBuilder.group({
      id: new FormControl(this.data.databaseId, Validators.required),
      confirmation: new FormControl(false, Validators.requiredTrue),
      privateKey: new FormControl(null, Validators.required),
      deleteDatabaseFile: new FormControl(false, Validators.required),
    });
  }
}
