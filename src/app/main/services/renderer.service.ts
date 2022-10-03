import {provide} from 'inversify-binding-decorators';
import {getMainWindowWebContents} from '../windows';

import * as sharedModels from '@isbit/shared';

@provide(RendererService)
export class RendererService {

  private mainWindowWebContents: Electron.WebContents;

  public sendPushNotification(options: sharedModels.PushNotificationOptionsModel): void {
    this.getWebContents().send('renderer:createPushNotification', options);
  }

  private getWebContents(): Electron.WebContents {
    if(this.mainWindowWebContents == null){
      this.mainWindowWebContents = getMainWindowWebContents();
    }

    return this.mainWindowWebContents;
  }
}
