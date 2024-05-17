import { Component, OnInit } from '@angular/core';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {ActivatedRoute, Router} from '@angular/router';
import {CiOperations} from '../../@core/Model/CiOperations';

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
  constructor(private showProjectService: ShowProjectService, private _route: ActivatedRoute,
              private router: Router) {
    this._entityId = +this._route.snapshot.paramMap.get('assetid');
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
    this.loadCiOperations();
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.assetType = params['assetType'];
      this.projectId = +params['projectId'];
      this.projectName = params['projectName'];
    });
    // alert(this.assetType + ' ' + this.projectId + ' ' + this.projectName + ' ' + this._entityId + '');
  }
  loadCiOperations() {
    return this.showProjectService.getCiForProject(this._entityId).subscribe(data => {
      this.ciOperations = data.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
      const success = this.ciOperations.filter((operation) => operation.result === 'Ok').length;
      this.ciOperationSuccessRate = Math.round((success / this.ciOperations.length) * 100);
    });
  }

}
