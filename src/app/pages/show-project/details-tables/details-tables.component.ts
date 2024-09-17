import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AlertColorComponent} from '../../extra-components/alert-color.component';
import {DetailsComponent} from '../../extra-components/details-component';
import {DescriptionToggleComponent} from '../../extra-components/description-toggle.component';
import {AuditResultColorComponent} from '../../extra-components/audit-result-color.component';
import {ShowProjectService} from '../../../@core/service/ShowProjectService';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AnalysisColorComponent} from '../../extra-components/analysis-color.component';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import {ProjectConstants} from '../../../@core/constants/ProjectConstants';
import {BugComponent} from '../../extra-components/bug-component';
import {ExtendedVulnerability, Vulnerability} from '../../../@core/Model/Vulnerability';
import {LocalDataSource} from 'ng2-smart-table';
import {VulnerabilitySourceComponent} from '../../extra-components/vulnerability-source-component';
import {StatusComponent} from '../../extra-components/status-component';
import {ClassificationColorComponent} from '../../extra-components/classification-color.component';
import {BugTracker} from '../../../@core/Model/BugTracker';
import {BugTrackerService} from '../../../@core/service/BugTrackerService';
import {VulnLocationComponent} from '../../extra-components/vuln-location-component';


@Component({
  selector: 'ngx-details-tables',
  templateUrl: './details-tables.component.html',
  styleUrls: ['./details-tables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  entryComponents: [AlertColorComponent, DetailsComponent, DescriptionToggleComponent, AuditResultColorComponent,
    AnalysisColorComponent, BugComponent, VulnerabilitySourceComponent, StatusComponent, ClassificationColorComponent],
})
export class DetailsTablesComponent implements OnInit {
  source: LocalDataSource;
  types: string[];
  vulnerabilities: Vulnerability[];
  vulnerabilitiesPojo: any = [];
  vulnerabilitiesSettings: any;
  _entityId: number;
  role: string;
  bugTrackers: BugTracker[];
  osBugTracker: boolean;
  codeBugTracker: boolean;
  webAppBugTracker: boolean;
  networkBugTracker: boolean;
  constants: ProjectConstants = new ProjectConstants();
  constructor( private showProjectService: ShowProjectService, private _route: ActivatedRoute, private router: Router,
               private cookieService: CookieService, private bugTrackerService: BugTrackerService) {
    this.role = this.cookieService.get('role');
    this._entityId = +this._route.snapshot.paramMap.get('projectid');
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
    this.createTableSettings();
    this.loadVulns();
    this.loadAudit();
    this.loadBugTrackersForProject();
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
  loadAudit() {
    return this.showProjectService.getAuditVulns(this._entityId).subscribe(data => {
    });
  }
  loadVulns() {
    return this.showProjectService.getVulnerabilities(this._entityId).subscribe(data => {
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
          projectId: this._entityId,
          id: vulnerability.id,
          name: vulnerability.vulnerability ? vulnerability.vulnerability.name : vulnerability.cisRequirement.name,
          location: location,
          severity: vulnerability.severity,
          grade: vulnerability.grade,
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
        const extendedVulnerabilities: ExtendedVulnerability[] = Object.values(groupedVulnerabilities);
        this.source = new LocalDataSource(extendedVulnerabilities);
      }
    });
  }
  ngOnInit() {
  }
  createTableSettings() {
    const that = this;
    this.vulnerabilitiesSettings = {
      actions: false,
      columns: {
        details: {
          title: 'Details',
          type: 'custom',
          renderComponent: DetailsComponent,
          filter: false,
          width: '5%',
          onComponentInitFunction(instance) {
            instance.refresh.subscribe((data) => {
              that.loadVulns();
            });
          },
        },
        status: {
          title: 'Status',
          type: 'custom',
          renderComponent: StatusComponent,
          width: '5%',
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                {value: 'New', title: 'New'},
                {value: 'Existing', title: 'Existing'},
              ],
            },
          },
        },
        source: {
          title: 'Source',
          type: 'custom',
          renderComponent: VulnerabilitySourceComponent,
          width: '10%',
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                {value: 'Network', title: 'Network'},
                {value: 'SourceCode', title: 'SourceCode'},
                {value: 'WebApplication', title: 'WebApplication'},
                {value: 'OpenSource', title: 'OpenSource'},
                {value: 'GitLeaks', title: 'GitLeaks'},
                {value: 'CISBenchmark', title: 'CIS Benchmark'},
                {value: 'IaC', title: 'IaC'},
              ],
            },
          },
        },
        location: {
          title: this.constants.PROJECT_DETAILS_LOCATION,
          type: 'custom',
          renderComponent: VulnLocationComponent,
          width: '20%',
        },
        name: {
          title: this.constants.PROJECT_DETAILS_NAME,
          type: 'string',
          width: '40%',
        },
        severity: {
          title: this.constants.PROJECT_DETAILS_SEVERITY,
          type: 'custom',
          width: '10%',
          renderComponent: AlertColorComponent,
          sortDirection: 'desc',
          compareFunction: (direction: any, a: any, b: any) => {
            let first = 0;
            let second = 0;
            if (a.toLowerCase() === 'critical') {
              first = 4;
            } else if (a.toLowerCase() === 'high') {
              first = 3;
            } else if (a.toLowerCase() === 'medium') {
              first = 2;
            } else {
              first = 1;
            }
            if (b.toLowerCase() === 'critical') {
              second = 4;
            } else if (b.toLowerCase() === 'high') {
              second = 3;
            } else if (b.toLowerCase() === 'medium') {
              second = 2;
            } else {
              second = 1;
            }
            if (first < second) {
              return -1 * direction;
            }
            if (first > second) {
              return direction;
            }
            return 0;
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                {value: 'Critical', title: 'Critical'},
                {value: 'High', title: 'High'},
                {value: 'Medium', title: 'Medium'},
                {value: 'Low', title: 'Low'},
              ],
            },
          },
        },
        grade: {
          title: 'Classification',
          type: 'custom',
          width: '7%',
          renderComponent: ClassificationColorComponent,
          sortDirection: 'desc',
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                {value: 1, title: 'Confirmed'},
                {value: 0, title: 'Not Relevant'},
                {value: -1, title: 'Not Set'},
              ],
            },
          },
        },
        inserted: {
          title: this.constants.PROJECT_DETAILS_LASTSEEN,
          type: 'date',
          width: '13%',
        },
        bugTracker: {
          title: 'Ticket',
          type: 'custom',
          renderComponent: BugComponent,
          filter: false,
          width: '5%',
          onComponentInitFunction(instance) {
            instance.refresh.subscribe((data) => {
              that.loadVulns();
            });
          },
        },
      },
    };
  }
  downloadCSV() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        this.constants.PROJECT_DETAILS_LOCATION,
        this.constants.PROJECT_DETAILS_NAME,
        this.constants.PROJECT_DETAILS_STATUS,
        this.constants.PROJECT_DETAILS_SEVERITY,
        this.constants.PROJECT_DETAILS_LASTSEEN,
      ],
    };
     new Angular5Csv(this.getExportedValues(), 'report', options);
  }

  getExportedValues() {
    const data = [];
    // @ts-ignore
    for (const row of this.source.getFilteredAndSorted().__zone_symbol__value) {
      data.push({
        interf: row.location,
        vulnName: row.name,
        status: row.status,
        severity: row.severity + (row.analysis != null ? ' / ' + row.analysis : ''),
        inserted: row.inserted,
      });
    }
    return data;
  }
}
// @ts-ignore
