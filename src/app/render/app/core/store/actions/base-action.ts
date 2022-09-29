export abstract class BaseAction {
  protected static getPrefix(): string {
    return 'BaseAction';
  };

  protected static type(actionName: string): string {
    return `[${this.getPrefix()}] ${actionName}`;
  }
}
