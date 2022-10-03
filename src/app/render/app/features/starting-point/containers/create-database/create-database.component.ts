import { Component } from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';

import {BaseComponent} from '@isbit/render/core/components';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import * as models from './models';
import {PushNotificationTypeModel} from '@isbit/render/core/modules/notification/models';
import {NotificationService} from '@isbit/render/core/modules/notification';

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
    private dialogRef: DialogRef,
    private notificationService: NotificationService
  ) {
    super();

    dialogRef.disableClose = true;

    this.onInit.subscribe(() => this.createForm());
  }

  public createDatabase(): void {
    if (this.createDatabaseForm.invalid) {
      this.notificationService.createPushNotification({
        notificationType: PushNotificationTypeModel.warning,
        message: 'Make sure to select where the database will be stored and set its name and password'
      });
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
