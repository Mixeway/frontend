import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CiOperations} from '../../../@core/Model/CiOperations';
import {NbDialogService} from '@nebular/theme';
import {AppDto, AssetConfig} from '../../../@core/Model/AssetConfig';
import * as yaml from 'js-yaml';
import {YamlService} from '../../../@core/service/YamlService';


@Component({
  selector: 'ngx-asset-cicd',
  templateUrl: './asset-cicd.component.html',
  styleUrls: ['./asset-cicd.component.scss'],
})
export class AssetCicdComponent implements OnInit {

  @Input() cicdOperations: CiOperations[];
  @Input() config: AssetConfig;
  @ViewChild('showConfigTemplate') showConfigTemplate: TemplateRef<any>; // Add this line

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
  yamlString: string;
  constructor(private dialogService: NbDialogService, private yamlService: YamlService) { }

  ngOnInit(): void {

  }

  showConfig() {
    if (this.config.code.sca_name === null) {
      this.config.code.sca_name = '# Fill with proper sca_name, create ling between Repo and SCA Project. SCA_NAME can be filled only on root elements or on all childs apps';
    }
    for (const app of this.config.code.apps) {
      if (app.sca_name === null ) {
        app.sca_name = '# Fill it';
      }
    }

    this.yamlString = this.yamlService.convertObjectToYaml(this.config);
    this.dialogService.open(this.showConfigTemplate);
  }
}
