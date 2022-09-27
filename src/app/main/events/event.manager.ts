import {ipcMain} from 'electron';
import {Container} from 'inversify';
import {TYPES} from '@isbit/main/ioc';
import {AppEvent} from './app-event';
import {EventRegistry} from './event-registry';

export class EventManager {
  static #events: AppEvent[] = [];

  public static async registerEvents(container: Container): Promise<void> {
    const appEvents: AppEvent[] = [];

    const registeredEvents = await container.getAllAsync(TYPES.AppEvent);

    registeredEvents.forEach((registeredEvent: EventRegistry)  => {
      appEvents.push(...registeredEvent.getEvents());
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
