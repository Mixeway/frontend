import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Risk} from '../../@core/Model/Risk';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ProjectConstants} from '../../@core/constants/ProjectConstants';
import {ScannerType} from '../../@core/Model/Scanner';
import {CiOperations} from '../../@core/Model/CiOperations';
import {NbDialogService, NbWindowService} from '@nebular/theme';
import {FormBuilder} from '@angular/forms';
import {Toast} from '../../@core/utils/Toast';
import {ProjectInfo} from '../../@core/Model/ProjectInfo';
import {VulnTrendChart} from '../../@core/Model/VulnTrendChart';
import {Severities} from '../../@core/Model/Severities';
import {ProjectStats} from '../../@core/Model/ProjectStats';
import {ProjectUser} from '../../@core/Model/ProjectUser';
import {Codes} from '../../@core/Model/Codes';
import {Metric} from '../../@core/Model/Metric';
import {DashboardService} from '../../@core/service/DashboardService';


@Component({
  selector: 'ngx-show-project',
  templateUrl: './show-project.component.html',
  styleUrls: ['./show-project.component.scss'],
})
export class ShowProjectComponent implements OnInit {
  @ViewChild('vulnAuditorSettings')
  showVulnAuditorDialog: TemplateRef<any>;
  risk: Risk;
  infraRiskCard: any;
  codeRiskCard: any;
  webAppRiskCard: any;
  auditRiskCard: any;
  openSourceCard: any;
  projectInfo: ProjectInfo = new ProjectInfo;
  _entityId: any;
  ciOperations: CiOperations[];
  ciOperationSuccessRate: any;
  scannerTypes: ScannerType[];
  showConfigTemplate: boolean;
  showVulnAuditor: boolean;
  showConfigTableTemplate: boolean = false;
  showDetailsTemplate: boolean;
  role: string;
  constants: ProjectConstants = new ProjectConstants();
  vulnTrendChart: VulnTrendChart;
  @ViewChild('showInstructions') showInstructions: TemplateRef<any>;
  hostname: string;
  severities: Severities;
  severitiesChartData: any = [];
  projectStats: ProjectStats;
  codes: Codes;
  assetNumber: number = 0;
  offset: number = 0;
  vulnsNumber: string = '0';
  vulnsColor: string = 'success';

  private vulnAuditorForm: any;
  private projectUserForm: any;
  projectUser: ProjectUser = new ProjectUser;
  globalMetric: Metric;
  projectMetric: Metric;
  vulnNumberColor: string;
  fixedVulnColor: string;
  ttmColor: string;
  cicdColor: string;
  secureCicd: string;
  btcolor: string;
  constructor(private showProjectService: ShowProjectService, private _route: ActivatedRoute, private router: Router,
              private cookieService: CookieService, private dialogService: NbDialogService,
              private formBuilder: FormBuilder, private toast: Toast, private windowService: NbWindowService,
              private cdRef: ChangeDetectorRef, private dashboardService: DashboardService) {
    this._entityId = +this._route.snapshot.paramMap.get('projectid');
    if (!this._entityId) {
      this.router.navigate(['/pages/dashboard']);
    }
    this.drawRiskCards(this._entityId);
    this.loadScannerTypes();
    this.loadProjectInfo();
    this.loadCiOperations();
    this.loadTrendChartData();
    this.loadProjectStats();
    this.loadCodes();
    this.updateOffset();
    this.loadProjectMetric();
    this.vulnAuditorForm = this.formBuilder.group({
      enableVulnAuditor: this.projectInfo.vulnAuditorEnable,
      dclocation: this.projectInfo.networkdc,
      appClient: this.projectInfo.appClient,
    });
    this.projectUserForm = this.formBuilder.group({
      user: this.projectUser.user,
    });
    this.updateShowDockerInfo();
  }
  loadTrendChartData() {
    return this.showProjectService.getVulnTrendChart(this._entityId).subscribe(data => {
      this.vulnTrendChart = data;
    });
  }
  loadSeveritiesChart() {
    return this.showProjectService.getSeverityChart(this._entityId).subscribe(data => {
      this.severities = data;
      this.severitiesChartData.push({value: data.Low, name: 'Low'});
      this.severitiesChartData.push({value: data.High, name: 'High'});
      this.severitiesChartData.push({value: data.Critical, name: 'Critical'});
      this.severitiesChartData.push({value: data.Medium, name: 'Medium'});
    });
  }
  updateShowDockerInfo() {
    const url = window.location.href;
    const arr = url.split('/');
    this.hostname = arr[0] + '//' + arr[2];

  }

  loadProjectInfo() {
    return this.showProjectService.getProjectInfo(this._entityId).subscribe(data => {
      this.projectInfo = data;
      this.vulnAuditorForm.patchValue({
        enableVulnAuditor: data.vulnAuditorEnable,
        dclocation: data.networkdc,
        appClient: data.appClient,
      });
    });
  }
  loadProjectStats() {
    return this.showProjectService.getProjectStats(this._entityId).subscribe(data => {
      this.projectStats = data;
      if (this.projectStats.vulnCrit > 0 ) {
        const numberOfVulns = this.projectStats.vulnCrit + this.projectStats.vulnMedium + this.projectStats.vulnLow;
        this.vulnsNumber = numberOfVulns > 99 ? '99+' : numberOfVulns + '';
        this.vulnsColor = 'danger';
      } else if (this.projectStats.vulnMedium > 0) {
        const numberOfVulns = this.projectStats.vulnCrit + this.projectStats.vulnMedium + this.projectStats.vulnLow;
        this.vulnsNumber = numberOfVulns > 99 ? '99+' : numberOfVulns + '';
        this.vulnsColor = 'warning';
      } else if (this.projectStats.vulnLow > 0) {
        const numberOfVulns = this.projectStats.vulnCrit + this.projectStats.vulnMedium + this.projectStats.vulnLow;
        this.vulnsNumber = numberOfVulns > 99 ? '99+' : numberOfVulns + '';
        this.vulnsColor = 'primary';
      } else {
        this.vulnsNumber = '0';
        this.vulnsColor = 'success';
      }
    });
  }
  drawRiskCards(id) {
    return this.showProjectService.getRiskCards(id).subscribe(data => {
      this.risk = data;
      this.infraRiskCard = this.riskCardBuilder(this.constants.PROJECT_CARD_INFRAP_TITLE,
        this.constants.PROJECT_CARD_INFRAP_TEXT,
        this.risk.assetNumber, this.risk.assetRisk);
      this.webAppRiskCard = this.riskCardBuilder(this.constants.PROJECT_CARD_WEBAPP_TITLE,
        this.constants.PROJECT_CARD_WEBAPP_TEXT,
        this.risk.webAppNumber, this.risk.webAppRisk);
      this.codeRiskCard = this.riskCardBuilder(this.constants.PROJECT_CARD_CODE_TITLE,
        this.constants.PROJECT_CARD_CODE_TEXT,
        this.risk.codeRepoNumber, this.risk.codeRisk);
      this.auditRiskCard = this.riskCardBuilder(this.constants.PROJECT_CARD_AUDIT_TITLE,
        this.constants.PROJECT_CARD_AUDIT_TEXT,
        this.risk.audit, this.risk.auditRisk);
      this.openSourceCard = this.riskCardBuilder(this.constants.PROJECT_CARD_OPENSOURCE_TITLE,
          this.constants.PROJECT_CARD_OPENSOURCE_TEXT,
          this.risk.openSourceLibs, this.risk.openSourceRisk);
      if (this.risk?.webAppNumber === 0 &&
        this.risk?.codeRepoNumber === 0 &&
        this.risk?.assetNumber === 0 &&
        this.risk?.audit === 0) {
          // this.windowService.open(
          //   this.showInstructions,
          //   { title: 'First step instruction', context: { text: 'some text to pass into template' } },
          // );
      }
    });
  }

  loadScannerTypes() {
    return this.showProjectService.getPossibleScanners().subscribe(data => {
      this.scannerTypes = data;
    });
  }
  loadCiOperations() {
    return this.showProjectService.getCiForProject(this._entityId).subscribe(data => {
      this.ciOperations = data.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
      const success = this.ciOperations.filter((operation) => operation.result === 'Ok').length;
      this.ciOperationSuccessRate = Math.round((success / this.ciOperations.length) * 100);
    });
  }
  ngOnInit() {
    this.loadSeveritiesChart();
    this.role = this.cookieService.get('role');
    this.showConfigTemplate = this.role !== 'ROLE_ADMIN' && this.role !== 'ROLE_EDITOR_RUNNER';
    this.showVulnAuditor = true;
    this.loadCodes();
    this.showDetailsTemplate = true;
    this.cdRef.detectChanges();
  }

  showConfig() {
    this.showConfigTableTemplate = true;
    this.showConfigTemplate = true;
    this.showDetailsTemplate = false;
    this.cdRef.detectChanges();
  }
  showDetails() {
    this.showConfigTableTemplate = false;
    this.showDetailsTemplate = true;
    this.showConfigTemplate = false;
    this.cdRef.detectChanges();
  }
  riskCardBuilder (name, inventoryName, inventoryCount, risk) {
    return {
      name: name,
      inventoryName: inventoryName,
      inventoryCount: inventoryCount,
      risk: risk,
    };
  }

  displayProjectGlobalSettings() {
    this.openCreateApiDialog(this.showVulnAuditorDialog);
  }
  openCreateApiDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      { context: 'this is some additional data passed to dialog' });
  }

  saveVulnAuditorSettings(ref) {
    return this.showProjectService.saveVulnAuditorSettings(this._entityId, this.vulnAuditorForm.value).subscribe(() => {
        this.toast.showToast('success', this.constants.PROJECT_OPERATION_SUCCESS,
          'Vuln Auditor Settings saved successfully.');
        this.loadProjectInfo();
        ref.close();
      },
      () => {
        this.toast.showToast('danger', this.constants.PROJECT_OPERATION_FAILURE,
          this.constants.PROJECT_OPERATION_FAILURES);
      });
  }


  saveProjectUser(ref) {
      return this.showProjectService.saveProjectUser(this._entityId, this.projectUserForm.value).subscribe(() => {
        this.toast.showToast('success', this.constants.PROJECT_OPERATION_SUCCESS,
          'Project Settings saved successfully.');
        this.loadProjectInfo();
        ref.close();
      },
      () => {
        this.toast.showToast('danger', this.constants.PROJECT_OPERATION_FAILURE,
          this.constants.PROJECT_OPERATION_FAILURES);
      });
  }

  flipped = false;

  toggleView() {
    this.flipped = !this.flipped;
  }
  loadCodes() {
    return this.showProjectService.getCodes(this._entityId).subscribe(data => {
      this.codes = data;
      this.assetNumber = this.assetNumber + this.codes.codeModels.length;
      this.updateOffset();
    });
  }
  updateOffset() {
    if (this.assetNumber === 1) {
      this.offset = 5;
    } else if (this.assetNumber === 2) {
      this.offset = 4;
    } else if (this.assetNumber === 3) {
      this.offset = 3;
    } else if (this.assetNumber === 4) {
      this.offset = 2;
    } else if (this.assetNumber === 5) {
      this.offset = 1;
    }
  }

  private loadProjectMetric() {
    return this.dashboardService.getMetric().subscribe(data => {
      this.globalMetric = data;
      return this.dashboardService.getProjectMetric(this._entityId).subscribe(projectMetric => {
        this.projectMetric = projectMetric;
        if (this.projectMetric.activeVulnAvg < this.globalMetric.activeVulnAvg) {
          this.vulnNumberColor = 'success';
        } else {
          this.vulnNumberColor = 'danger';
        }

        if (this.projectMetric.fixedVulnPercent < 20) {
          this.fixedVulnColor = 'danger';
        } else if (this.projectMetric.activeVulnAvg < 60) {
          this.fixedVulnColor = 'warning';
        } else {
          this.fixedVulnColor = 'success';
        }
        if (this.projectMetric.fixTime < 10) {
          this.ttmColor = 'success';
        } else {
          this.ttmColor = 'danger';
        }
        if (this.projectMetric.projectWithCicdNo > 0) {
          this.cicdColor = 'success';
        } else {
          this.cicdColor = 'danger';
        }
        if (this.projectMetric.secureJobPercent < 30) {
          this.secureCicd = 'danger';
        } else if (this.projectMetric.secureJobPercent < 80) {
          this.secureCicd = 'warning';
        } else {
          this.secureCicd = 'success';
        }
        if (this.projectMetric.bugTrackingIntegratedNo > 0) {
          this.btcolor = 'success';
        } else {
          this.btcolor = 'danger';
        }
      });
    });
  }
}
