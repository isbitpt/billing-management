export interface AppEvent {
  id: string | string[];
  invokable: boolean;
  callback: (event?: Electron.IpcMainEvent, ...args: any[]) => void;
}
