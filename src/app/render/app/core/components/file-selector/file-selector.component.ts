import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ElectronService} from '@isbit/render/core/services';
import * as sharedModels from '@isbit/shared';
import {FileFilterModel} from '@isbit/render/core/components/file-selector/models';

@Component({
  selector: 'isbit-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss']
})
export class FileSelectorComponent {

  @Output()
  public selectedFiles = new EventEmitter<string[]>();

  @Input()
  public dialogTitle = 'Select File';

  @Input()
  public multiple = false;

  @Input()
  public fileFilters: FileFilterModel[] = null;

  constructor(
    private electronService: ElectronService
  ) {}

  public selectFolder(): void {
    const basicProperties = [
      'openFile',
      'treatPackageAsDirectory',
      'dontAddToRecent',
    ];

    if(this.multiple) {
      basicProperties.push('multiSelections');
    }

    const dialogOptions = {
      title: this.dialogTitle,
      buttonLabel: 'Select',
      properties: basicProperties,
      filters: this.fileFilters || []
    };

    this.electronService.invokeEvent<sharedModels.UtilitiesSelectFolderResultModel>('utils:openFileDialog', dialogOptions)
    .subscribe(result => {
      if(result.canceled) {
        return;
      }

      this.selectedFiles.emit(result.filePaths);
    });
  }
}
