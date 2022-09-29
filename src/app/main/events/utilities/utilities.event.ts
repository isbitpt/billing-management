import {EventRegistry} from '../event-registry';
import {TYPES} from '@isbit/main/ioc';
import {provide} from 'inversify-binding-decorators';
import {AppEvent} from '../app-event';
import { dialog } from 'electron';

@provide(TYPES.AppEvent)
export class UtilitiesEvents implements EventRegistry {

  public getEvents(): AppEvent[] {
    return [{
      id: [
        'utils:openFolderDialog',
        'utils:openFileDialog'
      ],
      invokable: true,
      callback: async (event, options) => await dialog.showOpenDialog(options)
    }];
  }
}
