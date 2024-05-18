import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {ShowProjectService} from '../../../@core/service/ShowProjectService';
import {VulnTrendChart} from '../../../@core/Model/VulnTrendChart';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectConstants} from '../../../@core/constants/ProjectConstants';

@Component({
  selector: 'ngx-vuln-trend-area-stack',
  template: `
    <div echarts [options]="options" class="echart" *ngIf="vulnTrendChart?.series.length > 0"></div>
    <nb-alert status="info" *ngIf="vulnTrendChart?.series.length == 0">
      {{constants.PROJECT_CHARTS_TREND_NODATA}}</nb-alert>
  `,
})
export class VulnTrendAreaStackComponent implements OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;
  @Input() vulnTrendChart: VulnTrendChart;
  _entityId: number;
  constants: ProjectConstants = new ProjectConstants();

  constructor(private theme: NbThemeService,
              private showProjectService: ShowProjectService,
              private _route: ActivatedRoute, private router: Router) {
    this._entityId = +this._route.snapshot.paramMap.get('projectid');
    this._entityId = !this._entityId ? +this._route.snapshot.paramMap.get('assetid') : this._entityId;
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
  }

  ngOnInit() {
    if (this.vulnTrendChart) {
      this.drawChart();
    }
  }

  loadChartData() {
    return this.showProjectService.getVulnTrendChart(this._entityId).subscribe(data => {
      this.vulnTrendChart = data;
      this.drawChart();
    });
  }

  ngOnDestroy(): void {
  }
  drawChart() {

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts; // Make echarts available

      this.options = {
        backgroundColor: echarts.bg,
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: this.vulnTrendChart.legends,
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.vulnTrendChart.dates.reverse(),
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: this.createSerie(echarts),
      };
    });
  }

  createSerie(echarts: any) { // Accept echarts as a parameter
    const array: any = [];
    for (const entry of this.vulnTrendChart.series) {
      array.push({
        emphasis: {
          focus: 'series',
        },
        lineStyle: {
          width: 0,
        },
        smooth: true,
        name: entry.name,
        type: 'line',
        stack: 'Total amount',
        areaStyle: { normal: { opacity: echarts.areaOpacity } }, // Now echarts is accessible
        data: entry.values.reverse(),
      });
    }
    return array;
  }
}
