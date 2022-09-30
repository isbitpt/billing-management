import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as configurationStore from '@isbit/render/core/modules/configuration/store';
import * as ConfigurationActions from '@isbit/render/core/modules/configuration/store';

@Injectable()
export class ConfigurationService {
  public lastSelectedDatabase$ = this.store.select(configurationStore.selectLastSelectedDatabase);

  constructor(
    private store: Store
  ) {}

  public loadAppConfigurations(): void {
    this.store.dispatch(ConfigurationActions.LoadAppConfigurationStartAction());
  }
}
