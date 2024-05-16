import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-location-renderer',
  template: `<span [nbTooltip]="rowData.location">
    <pre>{{ (rowData.location.length > 40) ? (rowData.location | slice:0:40) + '...' : rowData.location }}</pre>
    </span>`,
})
export class LocationRendererComponent  {
  @Input() value: any;
  @Input() rowData: any;
}
