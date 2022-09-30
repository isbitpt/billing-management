import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs';
import {Dialog, DialogConfig, DialogRef} from '@angular/cdk/dialog';

import {BaseComponent} from '@isbit/render/core/components';
import {AuthenticationService} from '@isbit/render/core/modules/authentication';

import * as models from './models';
import {
  CreateDatabaseComponent,
  CreateDatabaseFormModel
} from '@isbit/render/features/starting-point/containers/create-database';
import {
  SelectDatabaseComponent,
  SelectDatabaseFormModel
} from '@isbit/render/features/starting-point/containers/select-database';
import {
  RemoveDatabaseComponent, RemoveDatabaseDialogDataModel,
  RemoveDatabaseFormModel
} from '@isbit/render/features/starting-point/containers/remove-database';
import {ConfigurationService} from '@isbit/render/core/modules/configuration';

@Component({
  selector: 'isbit-database-selector',
  templateUrl: './database-selector.component.html',
  styleUrls: ['./database-selector.component.scss']
})
export class DatabaseSelectorComponent extends BaseComponent {

  public databases: ReadonlyArray<models.DatabaseInfoModel>;
  public authFormKeys: typeof models.AuthFields = models.AuthFields;

  public authForm: FormGroup;

  private dialogRef: DialogRef;

  constructor(
    private authService: AuthenticationService,
    private configurationService: ConfigurationService,
    private formBuilder: FormBuilder,
    private dialog: Dialog
  ) {
    super();

    this.onInit.subscribe(() => this.createForm());
    this.onInit.subscribe(() => this.loadDatabases());
  }

  public onDbChange() {
    this.authForm.patchValue({
      password: ''
    });
  }

  public authToDb(): void {
    if (this.authForm.invalid) {
      alert('Invalid form input');
      return;
    }

    const formValues = this.authForm.getRawValue() as models.AuthFormModel;

    this.authService.authToDatabase(formValues.selectedDatabase, formValues.password);
  }

  public handlerCreateNewDatabase(): void{
    if (!!this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(CreateDatabaseComponent, {
      height: '50vh',
      width: '35vw'
    });

    this.dialogRef.closed
    .subscribe((result: CreateDatabaseFormModel | null) => {
      this.dialogRef = null;

      if (result == null) {
        return;
      }

      this.authService.createDatabase(result.name, result.location, result.privateKey);
    });
  }

  public handlerSelectDatabase(): void{
    if (!!this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(SelectDatabaseComponent, {
      height: '50vh',
      width: '35vw'
    });

    this.dialogRef.closed
    .subscribe((result: SelectDatabaseFormModel | null) => {
      this.dialogRef = null;

      if (result == null) {
        return;
      }

      this.authService.importDatabase(result.location, result.privateKey);
    });
  }

  public removeDb(): void {
    const selectedDatabaseControl = this.authForm.get(this.authFormKeys.selectedDatabase);

    if (selectedDatabaseControl.invalid) {
      alert('Invalid Database selected');
      return;
    }

    const selectedDatabase = this.databases.find(db => db.id === selectedDatabaseControl.getRawValue());

    this.dialogRef = this.dialog.open(RemoveDatabaseComponent, {
      height: '50vh',
      width: '35vw',
      data: {
        databaseId: selectedDatabase.id,
        name: selectedDatabase.name
      }
    } as DialogConfig<RemoveDatabaseDialogDataModel>);

    this.dialogRef.closed
      .subscribe((result: RemoveDatabaseFormModel | null) => {
        this.dialogRef = null;

        if (result == null || !result.confirmation) {
          return;
        }

        this.authService.removeDatabase(result.id, result.confirmation, result.deleteDatabaseFile, result.privateKey);

        this.authForm.patchValue({
          selectedDatabase: null
        });
      });
  }

  private createForm(): void {
    this.authForm = this.formBuilder.group({
      selectedDatabase: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  private loadDatabases(): void {
    this.authService.databases$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        withLatestFrom(
          this.configurationService.lastSelectedDatabase$
        ),
        map(([databases, lastSelectedDatabase]) => ({
          databases,
          lastSelectedDatabase
        }))
      ).subscribe(databasesInfos => {
        this.databases = databasesInfos.databases || [];

        if (this.databases.some(database => database.id === databasesInfos.lastSelectedDatabase)) {
          this.authForm.patchValue({
            selectedDatabase: databasesInfos.lastSelectedDatabase
          });
        } else if(this.databases.length > 0){
          this.authForm.patchValue({
            selectedDatabase: this.databases[0].id
          });
        } else {
          this.authForm.patchValue({
            selectedDatabase: null
          });
        }
    });

    this.authService.loggedDatabase$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(db => !!db)
      )
      .subscribe(db => {
        alert(`Logged in to the Bd '${db.name}'`);
      });

    this.authService.getDatabases();
  }
}
