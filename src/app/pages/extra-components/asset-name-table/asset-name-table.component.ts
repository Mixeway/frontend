import {Component, Input, OnInit} from '@angular/core';

@Component({
  template: `
      <p *ngIf="!parent">{{rowData.name}}</p>
      <p *ngIf="parent" nbTooltip="This repo may contain additional applications">
        <nb-icon icon="star" pack="eva" style="margin-right: 8px;"></nb-icon>
        <span><b>{{rowData.name}}</b></span></p>
  `,
})
export class AssetNameTableComponent implements OnInit {

  @Input() value: any;
  @Input() rowData: any;
  parent: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.rowData.type === 'codeProject' && this.rowData.path === null) {
      this.parent = true;
    }
  }

}
