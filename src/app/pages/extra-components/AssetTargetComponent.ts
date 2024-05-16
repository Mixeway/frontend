import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    {{text1}}<br/>
    <small *ngIf="text2">Default branch: {{text2}}</small>
  `,
})
export class AssetTargetComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  text1: string;
  text2: string;
  ngOnInit(): void {
    if (this.rowData.type === 'codeProject') {
      this.text1 = this.rowData.target;
      this.text2 = this.rowData.branch;
    } else {
      this.text1 = this.rowData.target;
    }
  }
}
