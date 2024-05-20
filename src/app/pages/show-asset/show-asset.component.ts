import { Component, OnInit } from '@angular/core';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {ActivatedRoute, Router} from '@angular/router';
import {CiOperations} from '../../@core/Model/CiOperations';
import {VulnTrendChart} from '../../@core/Model/VulnTrendChart';
import {AssetService} from '../../@core/service/AssetService';
import {NewVulnModel} from '../../@core/Model/NewVulnModel';
import {AssetDashboardModel} from '../../@core/Model/AssetDashboardModel';
import {ExtendedVulnerability, Vulnerability} from '../../@core/Model/Vulnerability';
import {BugTracker} from '../../@core/Model/BugTracker';
import {BugTrackerService} from '../../@core/service/BugTrackerService';

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
  vulnerabilitiesPojo: any = [];
  icon: string;
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
  vulnerabilities: Vulnerability[];
  bugTrackers: BugTracker[];
  osBugTracker: boolean;
  codeBugTracker: boolean;
  webAppBugTracker: boolean;
  networkBugTracker: boolean;
  extendedVulnerabilities: ExtendedVulnerability[];
  constructor(private showProjectService: ShowProjectService, private _route: ActivatedRoute,
              private router: Router, private assetService: AssetService,
              private bugTrackerService: BugTrackerService) {
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
    this.loadVulns();
    // this.loadBugTrackersForProject();
    if (this.assetType === 'codeProject') {
      this.icon = 'github-outline';
    } else if (this.assetType === 'webApp') {
      this.icon = 'browser-outline';
    } else if (this.assetType === 'interface') {
      this.icon = 'wifi-outline';
    }

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
  loadVulns() {
    return this.assetService.getVulnerabilities(this._entityId, this.assetType).subscribe(data => {
      this.vulnerabilities = data;
      this.vulnerabilitiesPojo = [];
      for (const vulnerability of data) {
        let location = '';
        if ( vulnerability.anInterface && (vulnerability.location !== vulnerability.anInterface.privateip)) {
          location = vulnerability.location + ' / ' + vulnerability.anInterface.privateip;
        } else {
          location = vulnerability.location;
        }
        const vuln1 = {
          projectId: this.projectId,
          id: vulnerability.id,
          name: vulnerability.vulnerability ? vulnerability.vulnerability.name : vulnerability.cisRequirement.name,
          location: location,
          severity: vulnerability.severity,
          grade: vulnerability.grade === -1 ? 3 : vulnerability.grade,
          status: vulnerability.status.name,
          analysis: vulnerability.analysis,
          inserted: vulnerability.inserted,
          source: vulnerability.vulnerabilitySource.name,
          ticketId: vulnerability.ticketId,
          osBug: this.osBugTracker,
          webAppBug: this.webAppBugTracker,
          codeBug: this.codeBugTracker,
          networkBug: this.networkBugTracker,
          codeProject: vulnerability.codeProject?.name,
          codeProjectBranch: vulnerability.codeProjectBranch,
        };
        this.vulnerabilitiesPojo.push(vuln1);
        const groupedVulnerabilities: { [key: string]: ExtendedVulnerability } = {};

        this.vulnerabilitiesPojo.forEach((vuln) => {
          // Tworzenie klucza na podstawie wybranych atrybutów
          const key = `${vuln.name}-${vuln.description}-${vuln.location}`;

          if (!groupedVulnerabilities[key]) {
            // Jeżeli nie ma jeszcze takiego klucza, tworzymy nowy obiekt ExtendedVulnerability
            const extendedVuln = new ExtendedVulnerability();
            Object.assign(extendedVuln, vuln);
            extendedVuln.codeProjectBranches = [vuln.codeProjectBranch];
            groupedVulnerabilities[key] = extendedVuln;
          } else {
            // Jeżeli klucz już istnieje, dodajemy tylko codeProjectBranch do listy
            groupedVulnerabilities[key].codeProjectBranches.push(vuln.codeProjectBranch);
          }
        });

        // Konwersja do tablicy
        this.extendedVulnerabilities = Object.values(groupedVulnerabilities);
      }
    });
  }
  loadBugTrackersForProject() {
    return this.bugTrackerService.getBugTrackers(this._entityId).subscribe(data => {
      this.bugTrackers = data;
      const checkBugTrackerExistence = dataParam => data.some( ({vulns}) => vulns === dataParam);
      this.webAppBugTracker = checkBugTrackerExistence('WebApplication');
      this.codeBugTracker = checkBugTrackerExistence('SourceCode');
      this.osBugTracker = checkBugTrackerExistence('OpenSource');
      this.networkBugTracker = checkBugTrackerExistence('Network');
    });
  }

}
