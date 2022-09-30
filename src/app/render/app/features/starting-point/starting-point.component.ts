import { Component } from '@angular/core';
import {BaseComponent} from '@isbit/render/core/components';
import {ConfigurationService} from '@isbit/render/core/modules/configuration';

@Component({
  selector: 'isbit-starting-point',
  templateUrl: './starting-point.component.html',
  styleUrls: ['./starting-point.component.scss']
})
export class StartingPointComponent extends BaseComponent {
  constructor(
    private configurationService: ConfigurationService
  ) {
    super();

    this.onInit.subscribe(() => this.loadConfigurations());
  }

  private loadConfigurations(): void {
    this.configurationService.loadAppConfigurations();
  }
}
