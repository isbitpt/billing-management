import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as sharedModels from '../../../../shared';
import {UserDatabase} from '../../../../shared';

const ipcRenderer = window.require('electron/renderer').ipcRenderer;

@Component({
  selector: 'isbit-home',
  templateUrl: './starting-point.component.html',
  styleUrls: ['./starting-point.component.scss']
})
export class StartingPointComponent implements OnInit {
  public databases: UserDatabase[];
  public selectedDb = '';
  public password = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
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
          console.error('Failed to login');
          return;
        }

        console.log(`Logged in to the Bd '${loggedBd.loggedBd.name}'`);
      });
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
