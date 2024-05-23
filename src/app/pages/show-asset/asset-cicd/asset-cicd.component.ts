import {Component, Input, OnInit} from '@angular/core';
import {CiOperations} from '../../../@core/Model/CiOperations';

@Component({
  selector: 'ngx-asset-cicd',
  templateUrl: './asset-cicd.component.html',
  styleUrls: ['./asset-cicd.component.scss'],
})
export class AssetCicdComponent implements OnInit {

  @Input() cicdOperations: CiOperations[];
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
