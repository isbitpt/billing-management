import {ipcMain} from 'electron';
import * as events from './features';

export class EventManager {
  static #events: AppEvent[] = [];

  public static registerEvents(): void {
    const appEvents: AppEvent[] = [];

    Object.entries(events).forEach(([name, eventClass]) => {
      const eventRegistry: EventRegistry = new eventClass();
      appEvents.push(...eventRegistry.getEvents());
    });

    appEvents.forEach(event => {
      if (event.invokable) {
        ipcMain.handle(event.id, event.callback);
      } else {
        ipcMain.on(event.id, event.callback);
      }

      this.#events.push(event);
    });
  }

  public static addEvent(newEvent: AppEvent): void {
    this.#events.push(newEvent);

    if (newEvent.invokable) {
      ipcMain.handle(newEvent.id, newEvent.callback);
    } else {
      ipcMain.on(newEvent.id, newEvent.callback);
    }
  }

  public static fireEvent(id, event?: any, ...args: any[]) {
    const appEvent = this.#events
      .find(e => e.id === id);

    if (appEvent == null) {
        throw new Error(`Event with id '${id}' was not found.`);
    }

    appEvent.callback(event, ...args);
  }
}

export interface EventRegistry {
  getEvents(): AppEvent[];
}

export interface AppEvent {
  id: string;
  invokable: boolean;
  callback: (event?: Electron.IpcMainEvent, ...args: any[]) => void;
}
