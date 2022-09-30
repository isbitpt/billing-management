import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@isbit/render/core/components';

@Component({
  selector: 'isbit-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent extends BaseComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    super();

    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log('Run in electron');
    } else {
      console.log('Run in browser');
    }
  }
}
