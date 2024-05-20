import { Component, OnInit } from '@angular/core';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {ActivatedRoute, Router} from '@angular/router';
import {CiOperations} from '../../@core/Model/CiOperations';
import {VulnTrendChart} from '../../@core/Model/VulnTrendChart';
import {AssetService} from '../../@core/service/AssetService';
import {NewVulnModel} from '../../@core/Model/NewVulnModel';
import {AssetDashboardModel} from '../../@core/Model/AssetDashboardModel';

interface Project {
  name: string;
  icon: string;
  location: string;
  createdAt: Date;
}


@Component({
  selector: 'ngx-show-asset',
  templateUrl: './show-asset.component.html',
  styleUrls: ['./show-asset.component.scss'],
})
export class ShowAssetComponent implements OnInit {
  newVulns: NewVulnModel[];
  assetDashboardModel: AssetDashboardModel;
  assetType: string;
  projectId: number;
  projectName: string;
  project: Project = {
    name: 'My Project',
    icon: 'github-outline',
    location: 'https://github.com/myusername/myproject',
    createdAt: new Date(),
  };
  branch: string = 'main';
  _entityId: number;
  ciOperations: CiOperations[];
  ciOperationSuccessRate: any;
  vulnTrendChart: VulnTrendChart;
  constructor(private showProjectService: ShowProjectService, private _route: ActivatedRoute,
              private router: Router, private assetService: AssetService) {
    this._entityId = +this._route.snapshot.paramMap.get('assetid');
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.assetType = params['assetType'];
      this.projectId = +params['projectId'];
      this.projectName = params['projectName'];
    });
    this.loadTrendChartData();
    this.loadCiOperations();
    this.loadNewVulns();
    this.loadAssetDashboard();

  }
  loadCiOperations() {
    return this.assetService.getCiOperations(this._entityId, this.assetType).subscribe(data => {
      this.ciOperations = data.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
      const success = this.ciOperations.filter((operation) => operation.result === 'Ok').length;
      this.ciOperationSuccessRate = Math.round((success / this.ciOperations.length) * 100);
    });
  }
  loadTrendChartData() {
    return this.assetService.getVulnTrendChart(this._entityId, this.assetType).subscribe(data => {
      this.vulnTrendChart = data;
    });
  }
  loadNewVulns() {
    return this.assetService.getNewVulns(this._entityId, this.assetType).subscribe(data => {
      this.newVulns = data;
    });
  }
  loadAssetDashboard() {
    return this.assetService.getAssetDashboard(this._entityId, this.assetType).subscribe(data => {
      this.assetDashboardModel = data;
    });
  }

}