import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {BaseComponent} from '@isbit/render/core/components';

import * as models from '@isbit/render/core/modules/notification/components/push-notification/models';
import {
  InternalNotificationService
} from '@isbit/render/core/modules/notification/services/internal-notification.service';

@Component({
  selector: 'isbit-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent extends BaseComponent {

  @Input()
  public options: models.PushNotificationOptionsModel;

  @ViewChild('notification')
  private notification: ElementRef<HTMLDivElement>;

  private dismissingTimeout: NodeJS.Timeout;

  constructor(
    private host: ElementRef<HTMLElement>,
    private internalNotificationService: InternalNotificationService
  ) {
    super();

    this.onInit.subscribe(() => this.handleDismissing());
    this.onInit.subscribe(() => this.handleCreation());
  }

  public dismiss(): void {
    if (this.dismissingTimeout != null) {
      clearTimeout(this.dismissingTimeout);
    }

    this.notification.nativeElement.classList.add('dismissing');
    setTimeout(() => {
      this.host.nativeElement.remove();
      this.internalNotificationService.removePushNotification(this.options.id);
    }, 1000);
  }

  private handleDismissing(): void {
    if ([
      models.PushNotificationTypeModel.info,
      models.PushNotificationTypeModel.success,
      models.PushNotificationTypeModel.warning
    ].some(types => types === this.options.notificationType)) {
      this.dismissingTimeout = setTimeout(() => {
        this.dismiss();
      }, 10000);
    }
  }

  private handleCreation(): void {
    this.internalNotificationService.setNotificationRendered(this.options.id);
  }
}
