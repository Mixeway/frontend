import {Component, Input, OnInit} from '@angular/core';
import {NewVulnModel} from '../../../@core/Model/NewVulnModel';

@Component({
  selector: 'ngx-new-vulns',
  templateUrl: './new-vulns.component.html',
  styleUrls: ['./new-vulns.component.scss'],
})
export class NewVulnsComponent implements OnInit {
  @Input() newVulns: NewVulnModel[];
  constructor() { }

  ngOnInit(): void {
    this.newVulns.forEach(vuln => {
      switch (vuln.severity) {
        case 'Critical':
        case 'High':
          vuln.status = 'danger';
          break;
        case 'Medium':
          vuln.status = 'warning';
          break;
        case 'Low':
          vuln.status = 'info';
          break;
        default:
          vuln.status = 'info';
      }
    });
  }

}
