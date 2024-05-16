import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-new-vulns',
  templateUrl: './new-vulns.component.html',
  styleUrls: ['./new-vulns.component.scss'],
})
export class NewVulnsComponent implements OnInit {
  newVulns: any = [
    {
      name: 'CVE-123',
      severity: 'Critical',
    },
    {
      name: 'CVE-321',
      severity: 'Medium',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
