import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-asset-scans',
  templateUrl: './asset-scans.component.html',
  styleUrls: ['./asset-scans.component.scss'],
})
export class AssetScansComponent implements OnInit {
  scans: { date: string, branch: string, commitId: string, type: string,
    source: string, critVulns: number, mediumVulns: number, lowVulns: number}[] = [
    {
      date: '2024-01-01 12:12:!2',
      branch: 'master',
      commitId: '12312321jmniu123',
      type: 'IaC',
      source: 'scheduled',
      critVulns: 2,
      mediumVulns: 3,
      lowVulns: 0,
    },
    {
      date: '2024-01-01 12:12:!2',
      branch: 'master',
      commitId: '12312321jmniu123',
      type: 'IaC',
      source: 'scheduled',
      critVulns: 2,
      mediumVulns: 3,
      lowVulns: 0,
    },
    {
      date: '2024-01-01 12:12:!2',
      branch: 'master',
      commitId: '12312321jmniu123',
      type: 'IaC',
      source: 'scheduled',
      critVulns: 2,
      mediumVulns: 3,
      lowVulns: 0,
    },
    {
      date: '2024-01-01 12:12:!2',
      branch: 'master',
      commitId: '12312321jmniu123',
      type: 'IaC',
      source: 'scheduled',
      critVulns: 2,
      mediumVulns: 3,
      lowVulns: 0,
    },
    {
      date: '2024-01-01 12:12:!2',
      branch: 'master',
      commitId: '12312321jmniu123',
      type: 'IaC',
      source: 'scheduled',
      critVulns: 2,
      mediumVulns: 3,
      lowVulns: 0,
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  // Add this to your component's typescript file
  getScanTypeClass(type: string) {
    switch (type) {
      case 'IaC':
        return 'info';
      case 'SAST':
        return 'primary';
      case 'SCA':
        return 'basic';
      case 'DAST':
        return 'control';
      case 'gitleaks':
        return 'success';
      default:
        return '';
    }
  }
}
