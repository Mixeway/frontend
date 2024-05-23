import {Component, Input, OnInit} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {StatusComponent} from '../../extra-components/status-component';
import {AlertColorComponent} from '../../extra-components/alert-color.component';
import {ClassificationColorComponent} from '../../extra-components/classification-color.component';
import {BugComponent} from '../../extra-components/bug-component';
import {DetailsComponent} from '../../extra-components/details-component';
import {VulnerabilitySourceComponent} from '../../extra-components/vulnerability-source-component';
import {ProjectConstants} from '../../../@core/constants/ProjectConstants';
import {LocationRendererComponent} from '../../extra-components/LocationRendererComponent';
import {Vulnerability} from '../../../@core/Model/Vulnerability';
import {NbOptionComponent} from '@nebular/theme';

@Component({
  selector: 'ngx-asset-vulns-table',
  templateUrl: './asset-vulns-table.component.html',
  styleUrls: ['./asset-vulns-table.component.scss'],
})
export class AssetVulnsTableComponent implements OnInit {
  @Input() vulns: Vulnerability[];
  @Input() defBranch: string;
  branches: string[];
  settings: any;
  constants: ProjectConstants = new ProjectConstants();
  source: LocalDataSource;
  constructor() {
    const that = this;
    this.settings = {
      mode: 'external',
      actions: {
        add: false,
        edit: false,
        delete: false,
      },
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
        name: {
          title: 'Name',
          filter: true,
        },
        location: {
          title: 'Location',
          filter: true,
          type: 'custom', // Indicate a custom renderer
          renderComponent: LocationRendererComponent, // Reference your component
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
                {value: 2, title: 'Not Set'},
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

  ngOnInit(): void {
    this.source = new LocalDataSource(this.filterVulnerabilities(this.vulns, this.defBranch));
    this.branches = this.getUniqueCodeProjectBranchNames(this.vulns);
  }
  loadVulns() {
  }

  onCustomAction($event: any) {
  }
  // Function to select unique code project branch names from a list of vulnerabilities
  getUniqueCodeProjectBranchNames(vulnerabilities: Vulnerability[]): string[] {
    // Create a set to store unique names
    const uniqueNames = new Set<string>();

    // Iterate through each vulnerability
    vulnerabilities.forEach(vulnerability => {
      // If the vulnerability has a code project branch, add its name to the set
      if (vulnerability.codeProjectBranch) {
        uniqueNames.add(vulnerability.codeProjectBranch.name);
      }
    });

    // Convert the set to an array and return it
    return Array.from(uniqueNames);
  }

  changeBranch(event: NbOptionComponent<string>) {
    this.source = new LocalDataSource(this.filterVulnerabilities(this.vulns, event + ''));

  }
  filterVulnerabilities(vulnerabilities: Vulnerability[], branch: string): Vulnerability[] {
    return vulnerabilities.filter(vuln => {
      if (!vuln.codeProjectBranch || vuln.codeProjectBranch.name === '') {
        return true;
      } else if (vuln.codeProjectBranch.name === branch) {
        return true;
      }
      return false;
    });
  }
  exportToCsv() {
    this.source.getAll().then((data) => {
      const csvData = this.convertToCsv(data);
      this.downloadCsv(csvData, 'vulnerabilities.csv');
    });
  }

  convertToCsv(data: any[]): string {
    const replacer = (key, value) => (value === null ? '' : value);
    const header = Object.keys(data[0]);
    const csv = data.map(row =>
      header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','),
    );
    csv.unshift(header.join(','));
    return csv.join('\r\n');
  }

  downloadCsv(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
