import {Component, Input, OnInit} from '@angular/core';
import {DashboardConstants} from '../../@core/constants/DashboardConstants';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {ScannerType} from '../../@core/Model/Scanner';
import {ProjectConstants} from '../../@core/constants/ProjectConstants';
import {DashboardTopStatistics} from '../../@core/Model/DashboardTopStatistics';
import {DashboardService} from '../../@core/service/DashboardService';
import {AllVulnTrendData} from '../../@core/Model/AllVulnTrendData';
import {AllSourceDataChart} from '../../@core/Model/AllSourceDataChart';
import {Project} from '../../@core/Model/Project';
import {DashboardStat} from '../../@core/Model/DashboardStat';
import {NbThemeService} from '@nebular/theme';

class EChartsOption {
}

@Component({
  selector: 'ngx-mixer-dashboard',
  templateUrl: './mixer-dashboard.component.html',
  styleUrls: ['./mixer-dashboard.component.scss'],
})
export class MixerDashboardComponent implements OnInit {
  scannerTypes: ScannerType[];
  trendResponse: AllVulnTrendData[];
  activeTab: String;
  constants: DashboardConstants = new DashboardConstants();
  constantsProject: ProjectConstants = new ProjectConstants();
  sourcesData: AllSourceDataChart;
  stats: DashboardTopStatistics = new DashboardTopStatistics();
  chartData: any = [];

  projectOptions: EChartsOption;
  vulnOptions: EChartsOption;

  themeSubscription: any;
  projects: Project[] = [];
  projectData: any;
  vulnDataNames: any;
  vulnDataOccurances: any;
  role: string;
  settings: any;
  loading: boolean = true;
  dashboardStat: DashboardStat;
  constructor( private showProjectService: ShowProjectService,
               private dashboardService: DashboardService,
               private theme: NbThemeService) {
  }

  ngOnInit() {
    this.loadScannerTypes();
    this.loadTrendData();
    this.loadSourceData();
    this.loadStatistics();
    this.getStats();
    this.drawChart();

  }
  loadStatistics() {
    return this.dashboardService.getRootStatistics().subscribe(data => {
      this.stats = data;
    });
  }
  loadTrendData() {
    return this.dashboardService.getTrendData().subscribe(data => {
      this.trendResponse = data.reverse();
    });
  }
  loadSourceData() {
    return this.dashboardService.getSourceTrendData().subscribe(data => {
      if (data != null) {
        this.sourcesData = data;
        this.chartData.push({value: data.code, name: 'Source Code'});
        this.chartData.push({value: data.soft, name: 'OpenSource'});
        this.chartData.push({value: data.audit, name: 'CIS Benchmark'});
        this.chartData.push({value: data.infra, name: 'Infrastructure'});
        this.chartData.push({value: data.webApp, name: 'Web Application'});
      }
    });
  }

  loadScannerTypes() {
    return this.showProjectService.getPossibleScanners().subscribe(data => {
      this.scannerTypes = data;
    });
  }

  changeTab(event: any) {
    this.activeTab = event.tabTitle;
  }
  getStats() {
    return this.dashboardService.stats().subscribe(stat => {
      this.dashboardStat = stat;
      this.projectData = [ ['score', 'vulnerabilities', 'project']];
      this.dashboardStat.projectStats.forEach( ps => this.projectData.push([ps.risk, ps.vulnerabilities,
        ps.name.length >= 8 ? ps.name.substring(0, 8 ) + '..' : ps.name]));
      this.vulnDataNames = this.dashboardStat.vulnStats.map(vs => vs.name);
      this.vulnDataOccurances = this.dashboardStat.vulnStats.map(vs => vs.occurances);
      this.drawChart();
    });
  }
  drawChart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.projectOptions = {
        dataset: {
          source: this.projectData,
        },
        grid: { containLabel: true },
        xAxis: { name: 'Vulns.' },
        yAxis: {
          type: 'category',
        },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Risk', 'Low Risk'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F'],
          },
        },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'vulnerabilities',
              // Map the "product" column to Y axis
              y: 'project',
            },
          },
        ],
      };
      this.vulnOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          data: this.vulnDataNames,
          axisLabel: {
            rotate: 60,
            width: 30,
            height: 50,
          },
        },
        yAxis: {},
        series: [
          {
            name: 'Vulnerability',
            data: this.vulnDataOccurances,
            type: 'bar',
            stack: 'x',
            itemStyle: {color: '#2e89db'},
          },
        ],
      };
    });
  }

}
