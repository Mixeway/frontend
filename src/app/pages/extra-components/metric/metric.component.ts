import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'ngx-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss'],
})
export class MetricComponent implements AfterViewInit {

  private value = 0;
  @Input() title: string;
  @Input() image: string;
  @Input() topLine: string;
  @Input() bottomLine: string;
  @Input() accent: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
  }

}
