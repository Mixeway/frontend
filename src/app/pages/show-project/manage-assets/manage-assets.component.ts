import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AssetTypeComponent} from '../../extra-components/AssetTypeComponent';
import {AssetTargetComponent} from '../../extra-components/AssetTargetComponent';
import {AssetScopeComponent} from '../../extra-components/AssetScopeComponent';
import {AssetVulnerabilitiesComponent} from '../../extra-components/AssetVulnerabilityComponent';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.scss'],
})
export class ManageAssetsComponent implements OnInit {
  settings: any;
  @ViewChild('editAsset') editAssetTemplate: TemplateRef<any>;
  @ViewChild('addAsset') addAssetTemplate: TemplateRef<any>;
  @ViewChild('deleteAsset') deleteAssetTemplate: TemplateRef<any>; // Add this line
  source: LocalDataSource;
  assetForm: FormGroup;
  editForm: FormGroup;
  selectedAsset: any; // To store the selected asset for editing

  data = [
    {
      id: 1,
      name: 'test',
      target: 'https://github.com',
      branch: 'test@test',
      type: 'codeProject',
      scope: ['sca', 'sast'],
      vulnerablities: {
        critical: 123,
        medium: 321,
        low: 1,
      },
    },
    {
      id: 2,
      name: 'test2',
      target: 'https://example.com',
      type: 'webApp',
      scope: ['dast'],
      vulnerablities: {
        critical: 123,
        medium: 321,
        low: 1,
      },
    },
    {
      id: 3,
      name: 'interface',
      target: '8.8.8.8',
      type: 'interface',
      scope: ['network'],
      vulnerablities: {
        critical: 123,
        medium: 321,
        low: 1,
      },
    },
  ];

  constructor(private dialogService: NbDialogService, private toastrService: NbToastrService, private fb: FormBuilder,
              private router: Router) {
    this.source = new LocalDataSource(this.data);
  }

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      assetType: ['', Validators.required],
      name: [''],
      repositoryUrl: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
      defaultBranch: [''],
      repositoryType: ['single'],
      apps: this.fb.array([]),
      appName: [''],
      appUrl: [''],
      authentication: ['none'],
      headerName: [''],
      apiKeyName: [''],
      basicAuth: [''],
      ip: [''],
      routingDomain: [''],
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      target: ['', Validators.required],
      branch: [''],
    });

    this.settings = {
      mode: 'external',
      actions: {
        custom: [
          {
            name: 'details',
            title: ' <i class="nb-list"></i>',
          },
          {
            name: 'editAction',
            title: '<i class="nb-edit" title="Edit"></i>',
          },
          {
            name: 'deleteAction',
            title: '<i class="nb-trash" title="delete"></i>',
          },
        ],
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        name: {
          title: 'Name',
          filter: true,
        },
        target: {
          title: 'Target',
          type: 'custom',
          renderComponent: AssetTargetComponent,
          filter: true,
        },
        type: {
          title: 'Type',
          type: 'custom',
          width: '10%',
          renderComponent: AssetTypeComponent,
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: [
                {value: 'interface', title: 'Network Interface'},
                {value: 'codeProject', title: 'Repository Code Project'},
                {value: 'webApp', title: 'WebApplication'},

              ],
            },
          },
        },
        scan: {
          title: 'Scan Scope',
          filter: false,
          type: 'custom',
          renderComponent: AssetScopeComponent,
        },
        vulns: {
          title: 'Vulnerabilities',
          type: 'custom',
          renderComponent: AssetVulnerabilitiesComponent,
          filter: false,
        },
      },
    };
  }

  openCreateApiDialog(dialog: TemplateRef<any>, event: any) {
    if (dialog === this.editAssetTemplate) {
      this.selectedAsset = event.data;
      this.editForm.patchValue({
        name: this.selectedAsset.name,
        target: this.selectedAsset.target,
        branch: this.selectedAsset.branch,
      });
    }
    this.dialogService.open(dialog, event);
  }

  onCustomAction(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate(['/pages/show/asset/' + event.data.id]);
        break;
      case 'editAction':
        this.openCreateApiDialog(this.editAssetTemplate, event);
        break;
      case 'deleteAction':
        this.selectedAsset = event.data; // Store the selected asset for deletion
        this.openCreateApiDialog(this.deleteAssetTemplate, event); // Open the delete confirmation dialog
        break;
    }
  }

  get apps(): FormArray {
    return this.assetForm.get('apps') as FormArray;
  }

  addApp() {
    this.apps.push(this.fb.group({
      appName: [''],
      appDirectory: [''],
    }));
  }

  removeApp(index: number) {
    this.apps.removeAt(index);
  }

  onSubmit(ref) {
    console.log(this.assetForm.value);
    this.toastrService.show('Asset created', 'Success', { status: 'success' });
    ref.close();
  }

  onSaveEdit(ref) {
    if (this.editForm.valid) {
      // Update the data source with the edited values
      this.selectedAsset.name = this.editForm.value.name;
      this.selectedAsset.target = this.editForm.value.target;
      this.selectedAsset.branch = this.editForm.value.branch;

      // Update the UI
      this.source.refresh();
      this.toastrService.show('Asset edited', 'Success', { status: 'success' });
      ref.close();
    }
  }

  // Method to delete the selected asset
  onDeleteAsset(ref) {
    // Find the index of the selected asset in the data array
    const index = this.data.findIndex(item => item.id === this.selectedAsset.id);

    if (index > -1) {
      // Remove the asset from the data array
      this.data.splice(index, 1);

      // Update the UI
      this.source.load(this.data);
      this.toastrService.show('Asset removed', 'Success', { status: 'success' });
      ref.close();
    }

  }
}
