import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <nb-icon [icon]="icon" [nbTooltip]="tooltip" [options]="{ animation: { type: 'zoom' } }" style="display: block; margin-left: auto; margin-right: auto;"></nb-icon>
  `,
})
export class AssetTypeComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  icon: string;
  tooltip: string;
  ngOnInit(): void {
    if (this.rowData.type === 'webApp') {
      this.icon = 'browser-outline';
      this.tooltip = 'Web Application';
    } else if (this.rowData.type === 'codeProject') {
      this.icon = 'code-outline';
      this.tooltip = 'Code Project Repository';
    } else {
      this.icon = 'wifi-outline';
      this.tooltip = 'Interface';
    }
  }
}
