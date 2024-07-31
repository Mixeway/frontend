import {ChangeDetectorRef, Component, Input, NgZone, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AssetTypeComponent} from '../../extra-components/AssetTypeComponent';
import {AssetTargetComponent} from '../../extra-components/AssetTargetComponent';
import {AssetScopeComponent} from '../../extra-components/AssetScopeComponent';
import {AssetVulnerabilitiesComponent} from '../../extra-components/AssetVulnerabilityComponent';
import {ActivatedRoute, Router} from '@angular/router';
import {AssetService} from '../../../@core/service/AssetService';
import {ProjectAsset} from '../../../@core/Model/ProjectAsset';
import * as _ from 'lodash';
import {AssetNameTableComponent} from '../../extra-components/asset-name-table/asset-name-table.component';



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
  @Input() projectName: string;
  source: LocalDataSource;
  assetForm: FormGroup;
  editForm: FormGroup;
  _entityId: any;
  selectedAsset: any; // To store the selected asset for editing
  isSubmitting = false;
  showSpinner = false;


  data: ProjectAsset[] = []; // Initialize as an empty array

  constructor(private dialogService: NbDialogService, private toastrService: NbToastrService, private fb: FormBuilder,
              private router: Router, private assetService: AssetService, private _route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
    this._entityId = +this._route.snapshot.paramMap.get('projectid');
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
  }

  ngOnInit(): void {

    this.source = new LocalDataSource(this.data);
    this.loadAssets(); // Fetch assets on component initialization
    this.assetForm = this.fb.group({
      assetType: ['', Validators.required],
      name: ['', Validators.required],
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
      id: [''],
      type: ['', Validators.required],
    });

    this.settings = {
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
        ],
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        name: {
          title: 'Name',
          type: 'custom',
          renderComponent: AssetNameTableComponent,
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
        id: this.selectedAsset.id,
        type: this.selectedAsset.type,
      });
    }
    this.dialogService.open(dialog, event);
  }

  onCustomAction(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate(['/pages/show/asset/' + event.data.id],
          { queryParams: { assetType: event.data.type, projectId: this._entityId,
            projectName: this.projectName} });
        break;
      case 'editAction':
        this.openCreateApiDialog(this.editAssetTemplate, event);
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

  clearForm() {
    // Clear the form values by iterating over all form controls and setting them to null
    for (const controlName in this.assetForm.controls) {
      if (this.assetForm.controls.hasOwnProperty(controlName)) {
        this.assetForm.controls[controlName].setValue(null);
      }
    }
  }
  onSubmit(ref) {

    // Disable the submit button and show the spinner
    this.isSubmitting = true;
    this.showSpinner = true;
    this.cdr.detectChanges(); // Manually trigger change detection

    // Make the request
    this.assetService.saveAsset(this._entityId, this.assetForm.value).subscribe(
      () => {
        this.toastrService.show('Asset created', 'Success', { status: 'success' });
        this.loadAssets();
        ref.close();
      },
      (error) => {
        this.toastrService.show('Asset not created, check all fields', 'Failure', { status: 'danger' });
        // Handle the error case here
      },
      () => {
        // Reset the submit button and hide the spinner once the request is complete
        this.isSubmitting = false;
        this.showSpinner = false;
        this.loadAssets();
        ref.close();
      },
    );
  }



  onSaveEdit(ref) {
    if (this.editForm.valid) {
      // Update the data source with the edited values
      this.selectedAsset.name = this.editForm.value.name;
      this.selectedAsset.target = this.editForm.value.target;
      this.selectedAsset.branch = this.editForm.value.branch;
      return this.assetService.editAsset(this.editForm.value.id, this.editForm.value).subscribe(() => {
          this.toastrService.show('Asset Edited', 'Success', { status: 'success' });
          ref.close();
          this.loadAssets();
          this.source.refresh();
        },
        () => {
          this.toastrService.show('Asset not edited, check all fields', 'Failure', { status: 'danger' });
        });
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
      this.source.load(this.data); // Refresh the LocalDataSource
      this.toastrService.show('Asset removed', 'Success', { status: 'success' });
      ref.close();
    }

  }
  loadAssets() {
    return this.assetService.getAssets(this._entityId).subscribe(response => {
      this.data = _.cloneDeep(response); // Deep clone the response
      this.source = new LocalDataSource(this.data);
      this.source.refresh(); // Refresh the LocalDataSource

    });
  }
  editAsset(event, ref) {

  }
}
