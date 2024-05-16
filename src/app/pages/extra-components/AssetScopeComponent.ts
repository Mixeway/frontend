import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <div *ngIf="rowData.type === 'codeProject'">
      <nb-icon
        icon="checkmark-square-outline"
        [nbTooltip]="'SCA configuration status: ' + (rowData.scope.includes('sca') ? 'OK' : 'Not Configured')"
        [status]="rowData.scope.includes('sca') ? 'success' : 'danger'"
      >
      </nb-icon>
      <nb-icon
        icon="checkmark-square-outline"
        [nbTooltip]="'SAST configuration status: ' + (rowData.scope.includes('sast') ? 'OK' : 'Not Configured')"
        [status]="rowData.scope.includes('sast') ? 'success' : 'danger'"
      >
      </nb-icon>
    </div>
    <div *ngIf="rowData.type === 'webApp'">
      <nb-icon
        icon="checkmark-square-outline"
        [nbTooltip]="'DAST configuration status: ' + (rowData.scope.includes('dast') ? 'OK' : 'Not Configured')"
        [status]="rowData.scope.includes('dast') ? 'success' : 'danger'"
      >
      </nb-icon>
    </div>
    <div *ngIf="rowData.type === 'interface'">
      <nb-icon
        icon="checkmark-square-outline"
        [nbTooltip]="'Network scan configuration status: ' + (rowData.scope.includes('network') ? 'OK' : 'Not Configured')"
        [status]="rowData.scope.includes('network') ? 'success' : 'danger'"
      >
      </nb-icon>
    </div>
  `,
})
export class AssetScopeComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  icon: string;
  tooltip: string;
  ngOnInit(): void {
  }
}
