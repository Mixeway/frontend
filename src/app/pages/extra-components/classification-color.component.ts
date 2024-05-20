import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <span [class]="'badge ' + class" style="display: block; margin-left: auto; margin-right: auto;">{{ severity }}</span>
  `,
})
export class ClassificationColorComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  severity: string;
  class: string;
  ngOnInit(): void {
    if (this.rowData.grade === 1) {
      this.severity = 'Confirmed';
      this.class = 'badge-danger';
    } else if (this.rowData.grade === 0) {
      this.severity = 'Not Relevant';
      this.class = 'badge-success';
    } else {
      this.severity = 'Not Set';
      this.class = 'badge-info';
    }
  }
}
