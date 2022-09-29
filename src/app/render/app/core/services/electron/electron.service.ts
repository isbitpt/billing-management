import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { IpcRenderer, Dialog } from 'electron';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  public dialog: Dialog | any;

  private ipcRenderer: IpcRenderer | any;

  constructor() {
    if (this.isElectron) {
      const electron = window.require('electron');

      this.ipcRenderer = electron.ipcRenderer;
      this.dialog = electron.dialog;
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
}
