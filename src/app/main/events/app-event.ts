export interface AppEvent {
  id: string;
  invokable: boolean;
  callback: (event?: Electron.IpcMainEvent, ...args: any[]) => void;
}
