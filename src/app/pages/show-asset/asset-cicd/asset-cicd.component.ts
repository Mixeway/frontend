import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-asset-cicd',
  templateUrl: './asset-cicd.component.html',
  styleUrls: ['./asset-cicd.component.scss'],
})
export class AssetCicdComponent implements OnInit {

  cicd: any = [
    {
      result: 'NOK',
      date: '2024-12-12 12:12:12',
      commitid: '123312312e123213',
      branch: 'main',
      sast: true,
      dast: true,
      sca: true,
      secrets: false,
    },
    {
      result: 'NOK',
      date: '2024-12-12 12:12:12',
      commitid: '123312312e123213',
      branch: 'main',
      sast: true,
      dast: true,
      sca: true,
      secrets: false,
    },
    {
      result: 'NOK',
      date: '2024-12-12 12:12:12',
      commitid: '123312312e123213',
      branch: 'main',
      sast: true,
      dast: true,
      sca: true,
      secrets: false,
    },
    {
      result: 'NOK',
      date: '2024-12-12 12:12:12',
      commitid: '123312312e123213',
      branch: 'main',
      sast: true,
      dast: true,
      sca: true,
      secrets: false,
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
