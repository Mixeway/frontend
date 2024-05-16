import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {StatusComponent} from '../../extra-components/status-component';
import {AlertColorComponent} from '../../extra-components/alert-color.component';
import {ClassificationColorComponent} from '../../extra-components/classification-color.component';
import {BugComponent} from '../../extra-components/bug-component';
import {DetailsComponent} from '../../extra-components/details-component';
import {VulnerabilitySourceComponent} from '../../extra-components/vulnerability-source-component';
import {ProjectConstants} from '../../../@core/constants/ProjectConstants';
import {LocationRendererComponent} from '../../extra-components/LocationRendererComponent';

@Component({
  selector: 'ngx-asset-vulns-table',
  templateUrl: './asset-vulns-table.component.html',
  styleUrls: ['./asset-vulns-table.component.scss'],
})
export class AssetVulnsTableComponent implements OnInit {
  settings: any;
  constants: ProjectConstants = new ProjectConstants();
  source: LocalDataSource;
  data = [
    {
      id: 1,
      projectId: 1,
      name: 'CVE-123',
      location: 'https://github.com',
      source: 'webAppScan',
      severity: 'Critical',
      grade: 1,
      status: 'new',
      inserted: '2023-04-12 12:12:12',
      ticketId: 123,
    },
    {
      id: 2,
      projectId: 1,
      name: 'CVE-1234',
      location: '/asd/dsa/asd/asd/dsa/asd/asd/dsa/asd/asd/dsa/asd/asd/dsa/asd:312',
      source: 'codeProject',
      severity: 'Critical',
      grade: 0,
      status: 'existing',
      inserted: '2023-04-12 12:12:12',
    },
    {
      id: 3,
      projectId: 1,
      name: 'CVE-1235',
      location: '/dsa/dsa/dsa:321',
      source: 'IaC',
      severity: 'Medium',
      grade: -1,
      status: 'existing',
      inserted: '2023-04-12 12:12:12',
    },
  ];
  constructor() {
    this.source = new LocalDataSource(this.data);
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

  ngOnInit(): void {
  }
  loadVulns() {
  }

  onCustomAction($event: any) {
  }
}
