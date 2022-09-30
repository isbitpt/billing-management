/* eslint-disable @typescript-eslint/naming-convention */
export class Constants {
  public static AppRoot: string = __dirname;
}

enum AppConfigNames {
  SelectedDatabase = 'selectedDatabase'
}

export const AppConfigurationDomains = {
  AppConfig: {
    domain: 'appConfig',
    names: AppConfigNames
  },
};

