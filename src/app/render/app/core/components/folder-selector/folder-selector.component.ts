import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ElectronService} from '@isbit/render/core/services';
import * as sharedModels from '@isbit/shared';

@Component({
  selector: 'isbit-folder-selector',
  templateUrl: './folder-selector.component.html',
  styleUrls: ['./folder-selector.component.scss']
})
export class FolderSelectorComponent {

  @Output()
  public selectedFolders = new EventEmitter<string[]>();

  @Input()
  public dialogTitle = 'Select folder';

  @Input()
  public multiple = false;

  constructor(
    private electronService: ElectronService
  ) {}

  public selectFolder(): void {
    const basicProperties = [
      'openDirectory',
      'createDirectory',
      'promptToCreate',
      'treatPackageAsDirectory',
      'dontAddToRecent',
    ];

    if(this.multiple) {
      basicProperties.push('multiSelections');
    }

    this.electronService.invokeEvent<sharedModels.UtilitiesSelectFolderResultModel>('utils:openFolderDialog', {
      title: this.dialogTitle,
      buttonLabel: 'Select',
      properties: basicProperties
    })
    .subscribe(result => {
      if(result.canceled) {
        return;
      }

      this.selectedFolders.emit(result.filePaths);
    });
  }
}
