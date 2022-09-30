import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';

import {ElectronService} from '@isbit/render/core/services';
import * as sharedModels from '@isbit/shared';

import * as ConfigurationActions from '@isbit/render/core/modules/configuration/store/configuration.action';

@Injectable()
export class ConfigurationEffect {

  public loadAppConfigurationStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(ConfigurationActions.ConfigurationAction.ActionTypes.LOAD_APP_CONFIGURATION_START_ACTION),
      mergeMap(() => this.electronService
        .invokeEvent<sharedModels.ConfigurationLoadConfigurationResultModel>('configuration:loadConfiguration')
        .pipe(
          catchError(e => EMPTY)
        )),
      mergeMap(res => of(ConfigurationActions.LoadAppConfigurationCompleteAction(res)))
    ));

  constructor(
    private actions$: Actions,
    private electronService: ElectronService
  ) {}
}
