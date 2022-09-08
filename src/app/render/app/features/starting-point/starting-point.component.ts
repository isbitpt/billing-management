import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as sharedModels from '@isbit/shared';

const ipcRenderer = window.require('electron/renderer').ipcRenderer;

@Component({
  selector: 'isbit-starting-point',
  templateUrl: './starting-point.component.html',
  styleUrls: ['./starting-point.component.scss']
})
export class StartingPointComponent implements OnInit {
  public databases: sharedModels.UserDatabase[];
  public selectedDb = '';
  public password = '';

  constructor(private router: Router) { }

  public ngOnInit(): void {
    console.log('StartingPointComponent INIT');

    this.loadDatabases();
  }

  public onDbChange() {
    this.password = '';
  }

  public authToDb(): void {
    ipcRenderer.invoke('auth:canLogin', this.selectedDb, this.password)
      .then((loggedBd: sharedModels.AuthLoginToBdResult) => {
        if (!loggedBd.success) {
          alert('Failed to login');
          return;
        }

        alert(`Logged in to the Bd '${loggedBd.loggedBd.name}'`);
      });
  }

  public handlerCreateNewDatabase(): void{
    alert('Create new database');
  }

  public handlerSelectDatabase(): void{
    alert('handlerSelectDatabase is clicked');
  }

  private loadDatabases(): void {
    ipcRenderer.invoke('auth:loadDatabases')
      .then((loadedDatabases: sharedModels.AuthLoadDatabasesResult) => {
        this.databases = loadedDatabases.databases;

        if (this.databases.length > 0) {
          this.selectedDb = this.databases[0].id;
        }
      });
  }
}
