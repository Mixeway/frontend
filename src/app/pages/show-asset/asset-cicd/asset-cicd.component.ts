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
    // Check if sca_name is null and update it if necessary
    if (this.config.code.sca_name === null) {
      this.config.code.sca_name = '# Fill with proper sca_name';
    }

    // Check if apps array is empty or contains elements
    if (this.config.code.apps.length === 0) {
      // Remove the apps attribute if the array is empty
      delete this.config.code.apps;
    } else {
      // Iterate over apps array and update sca_name if necessary
      for (const app of this.config.code.apps) {
        if (app.sca_name === null) {
          app.sca_name = '# Fill it';
        }
      }
    }

    // Convert the updated config object to YAML
    this.yamlString = this.yamlService.convertObjectToYaml(this.config);

    // Open the dialog to show the config
    this.dialogService.open(this.showConfigTemplate);
  }
}
