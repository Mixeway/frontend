import {ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Severities} from '../../../@core/Model/Severities';
import {VulnTrendChart} from '../../../@core/Model/VulnTrendChart';

@Component({
  selector: 'ngx-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.scss'],
})
export class TrendChartComponent implements OnInit {

  @Input() showDetailsTemplate: boolean;
  @Input() vulnTrendChart: VulnTrendChart;
  flipped: boolean = false;
  counter: number = 0;
  @Input() severities: Severities;
  @ViewChild('pieChart') pieChartComponent;
  constructor( private cdr: ChangeDetectorRef,  private zone: NgZone) { }

  ngOnInit(): void {
  }
  toggleView() {
    this.flipped = !this.flipped;
  }

  onTabChange() {
    if (this.counter !== 0) {
      this.flipped = true;
      this.zone.run(() => {
        this.pieChartComponent.drawChart();
        this.cdr.detectChanges();
      });
    }
    this.counter++;
  }
}
