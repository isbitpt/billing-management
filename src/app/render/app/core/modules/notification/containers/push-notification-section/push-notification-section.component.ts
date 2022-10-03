import {Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';

import {BaseComponent} from '@isbit/render/core/components';

import * as models from './models';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs';
import {PushNotificationComponent} from '@isbit/render/core/modules/notification/components/push-notification';
import {
  InternalNotificationService
} from '@isbit/render/core/modules/notification/services/internal-notification.service';

@Component({
  selector: 'isbit-push-notification-section',
  templateUrl: './push-notification-section.component.html',
  styleUrls: ['./push-notification-section.component.scss']
})
export class PushNotificationSectionComponent extends BaseComponent {

  @ViewChild('notificationContainer', { read: ViewContainerRef })
  public notificationsContainer: ViewContainerRef;

  constructor(
    private internalNotificationService: InternalNotificationService,
    private renderer: Renderer2
  ) {
    super();

    this.onInit.subscribe(() => this.handlePushNotifications());
  }

  private handlePushNotifications(): void {
    this.internalNotificationService.pushNotifications$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(notifications => notifications.filter(notification => !notification.rendered)),
        withLatestFrom(this.internalNotificationService.canRender$),
        map(([notifications, canRender]) => ({
          notifications,
          canRender
        })),
        filter(data => data.canRender && data.notifications.length > 0)
      )
      .subscribe(data => {
        this.internalNotificationService.toggleAllowRender(false);

        data.notifications.forEach(notification => {
          this.render(notification);
        });

        this.internalNotificationService.toggleAllowRender(true);
      });
  }

  private render(notification: models.PushNotificationModel): void {
    const newNotification = this.notificationsContainer.createComponent(PushNotificationComponent);
    newNotification.instance.options = {
      id: notification.id,
      notificationType: notification.notificationType,
      message: notification.message
    };
  }
}
