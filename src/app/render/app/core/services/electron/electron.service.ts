import { Injectable } from '@angular/core';

import { IpcRenderer, Dialog } from 'electron';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import * as Electron from 'electron';

import * as sharedModels from '@isbit/shared';
import {NotificationService} from '@isbit/render/core/modules/notification';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  public dialog: Dialog | any;

  private ipcRenderer: IpcRenderer | any;

  constructor(
    private notificationService: NotificationService
  ) {
    if (this.isElectron) {
      const electron = window.require('electron');

      this.ipcRenderer = electron.ipcRenderer;
      this.dialog = electron.dialog;

      this.setEvents();
    } else {
      this.ipcRenderer = {
        async invoke(event: string, ...args: any): Promise<any> {
          return null;
        }
      };

      console.warn('Electron environment not available!');
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public invokeEvent<TValue>(eventName: string, ...args: any[]): Observable<TValue> {
    return fromPromise(this.ipcRenderer.invoke(eventName, ...args));
  }

  private setEvents(): void {
    this.ipcRenderer
      .on('renderer:createPushNotification', (event: Electron.IpcRendererEvent, options: sharedModels.PushNotificationOptionsModel) => {
      this.notificationService.createPushNotification(options);
    });
  }
}
