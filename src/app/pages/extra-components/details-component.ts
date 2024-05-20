import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';
import {NbWindowService} from '@nebular/theme';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {Vulnerability} from '../../@core/Model/Vulnerability';
import {Toast} from '../../@core/utils/Toast';
import {ProjectAudit} from '../../@core/Model/ProjectAudit';
import {VulnerabilityHistoryRequest} from '../../@core/Model/VulnerabilityHistoryRequest';

interface EventItem {
  status?: 'Asset Created' | 'Vulnerability Added' | 'Vuln re-detected' | 'Resolved';
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  template: `
    <ng-template #vulnerability style="display: flex;flex-direction: column;">
      <div class="modal-body px-0">
        <div style="overflow-y: hidden; height: calc(100vh - 15rem);">
          <div class="px-2" style="overflow-y: auto; height: 100%;">
            <div class="row" *ngIf="grade === 1">
              <div class="col-md-12">
                <nb-alert status="danger" nbTooltip="Vulnerability
can be marked by Mixeway Vuln Auditor or manualy by a user, read docs to get more informations.">This vulnerability is marked as confirmed and important. </nb-alert>
              </div>
            </div>
            <div class="row" *ngIf="grade === 0">
              <div class="col-md-12">
                <nb-alert status="success" nbTooltip="Vulnerability
can be marked by Mixeway Vuln Auditor or manualy by a user, read docs to get more informations.">This vulnerability is marked as not confirmed or not relavant in given context. </nb-alert>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Asset Affected
                  </nb-card-header>
                  <nb-card-body>
                    {{ asset }}
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Vulnerability location
                  </nb-card-header>
                  <nb-card-body>
                    {{ location }}
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row" *ngIf="rowData.codeProjectBranches">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Branches in which vulnerability was found
                  </nb-card-header>
                  <nb-card-body>
                    <div *ngFor="let branch of rowData.codeProjectBranches">
                      {{ branch?.name }}
                    </div>
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Vulnerability Description
                  </nb-card-header>
                  <nb-card-body [innerHTML]="description" style="white-space: pre-wrap;">
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row" *ngIf="recommendation">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Vulnerability Recommendation
                  </nb-card-header>
                  <nb-card-body [innerHTML]="recommendation" style="white-space: pre-wrap;">
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row" *ngIf="events">
              <div class="col-md-12" >
                <nb-card>
                  <nb-card-header>
                    VulnerabilityTimeline
                  </nb-card-header>
                  <nb-card-body  >
                    <p-timeline *ngIf="events.length>0" [value]="events">
                      <ng-template pTemplate="content" let-event>
                        <small class="p-text-secondary">{{ event.date }}</small>
                      </ng-template>
                      <ng-template pTemplate="opposite" let-event>
                        {{ event.status }}
                      </ng-template>
                      <ng-template pTemplate="marker" let-event>
                        <nb-icon  [icon]="event.icon" pack="eva" [style.backgroundColor]="event.color" style="border-radius: 7px"></nb-icon>
                      </ng-template>
                    </p-timeline>
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Last seen
                  </nb-card-header>
                  <nb-card-body>
                    {{ inserted }}
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
            <div class="row" *ngIf="references">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    References
                  </nb-card-header>
                  <nb-card-body [innerHTML]="references" style="white-space: pre-wrap;">
                  </nb-card-body>
                </nb-card>
              </div>
            </div>

            <div class="row align-content-center">
              <div class="col-md-12">
                <nb-card>
                  <nb-card-header>
                    Manually set the grade for given vulnerability
                  </nb-card-header>
                  <nb-card-body class="d-flex flex-wrap">
                    <button nbButton outline status="success" [disabled]="grade==0" (click)="setGradeForVuln(0)" class="mr-2 mb-2">Mark as not relevant</button>
                    <button nbButton outline status="danger" [disabled]="grade==1" (click)="setGradeForVuln(1)" class="mb-2">Confirm as Must be fixed</button>
                  </nb-card-body>
                </nb-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <button nbButton nbTooltip="Read more..." (click)="openWindowWithBackdrop()" ><nb-icon icon="more-horizontal-outline"
                                            [options]="{ animation: { type: 'zoom' } }" style="display: block; margin-left: auto; margin-right: auto;"></nb-icon></button>
  `,
})
export class DetailsComponent implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  @ViewChild('vulnerability', { read: TemplateRef }) escCloseTemplate: TemplateRef<HTMLElement>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  vulnerability: Vulnerability;
  location: string;
  inserted: string;
  description: string;
  recommendation: string;
  asset: string;
  references: string;
  grade: number;
  bugTrackerEnabled: boolean;
  vulnAudits: ProjectAudit[];
  vuln: VulnerabilityHistoryRequest = new VulnerabilityHistoryRequest();
  events: EventItem[] = [];
  constructor(private windowService: NbWindowService, private showProjectService: ShowProjectService,
              private toast: Toast) {
  }
  loadVulnAudit(source, id) {
    return this.showProjectService.getHistoryForVuln(id, this.vuln, source).subscribe(data => {
      this.events.push({ status: 'Asset Created', date: '', icon: 'edit-outline', color: 'rgba(102,243,232,0.71)' });
      for (const item of data) {
        if (item.eventType === 'CREATED') {
          this.events.push(
            {status: 'Vulnerability Added', date: item.start + ', number: ' + item.occurances, icon: 'plus-outline',
              color: 'rgba(218,58,89,0.71)'},
          );
        } else if (item.eventType === 'UPDATED') {
          this.events.push(
            {status: 'Vuln re-detected', date: item.start + ', number: ' + item.occurances, icon: 'share-outline',
              color: 'rgba(41,110,185,0.71)'},
          );

        } else if (item.eventType === 'RESOLVED') {
          this.events.push(
            {status: 'Resolved', date: item.end + ', number: ' + item.occurances, icon: 'checkmark-outline',
              color: 'rgba(96,164,75,0.71)'},
          );
        }
      }
      const eventTypeOrder = { 'Vulnerability Added': 0, 'Vuln re-detected': 1, 'Resolved': 2 };

      this.events.sort((a, b) => {
        if (a.date === '') return -1;
        if (b.date === '') return 1;

        const dateA = new Date(a.date.split(', ')[0]);
        const dateB = new Date(b.date.split(', ')[0]);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        return eventTypeOrder[a.status] - eventTypeOrder[b.status];
      });
    });
  }

  loadVulnerability() {
    return this.showProjectService.getVulnerability(this.rowData.projectId, this.rowData.id).subscribe(data => {
      this.vulnerability = data;
      this.location = data.location;
      this.inserted = data.inserted;
      this.vuln.location = data.location;
      this.vuln.vulnerability = this.vulnerability.vulnerability.name;

      if (data.vulnerabilitySource.name === 'Network') {
        this.loadVulnAudit('interface', data.anInterface.id);
        this.asset = data.anInterface.asset.name + ' / ' + data.anInterface.privateip;
      } else if (data.vulnerabilitySource.name === 'SourceCode') {
        this.loadVulnAudit('code', data.codeProject.id);
        this.asset = data.codeProject.name;
      } else if (data.vulnerabilitySource.name === 'GitLeaks') {
        this.loadVulnAudit('code', data.codeProject.id);
        this.asset = data.codeProject.name;
      } else if (data.vulnerabilitySource.name === 'IaC') {
        this.loadVulnAudit('code', data.codeProject.id);
        this.asset = data.codeProject.name;
      } else if (data.vulnerabilitySource.name === 'WebApplication') {
        this.loadVulnAudit('webapp', data.webApp.id);
        this.asset = data.webApp.url;
      } else if (data.vulnerabilitySource.name === 'OpenSource') {
        this.loadVulnAudit('code', data.codeProject.id);
        this.asset =  data.codeProject.name;
      } else if (data.vulnerabilitySource.name === 'CISBenchmark') {
        this.asset = data.location;
      }
      this.references = data.vulnerability ? data.vulnerability.refs : '';
      this.description = data.description;
      this.recommendation = data.vulnerability ? data.vulnerability.recommendation : '';
      this.grade = data.grade;
      this.windowService.open(
        this.escCloseTemplate,
        { title: this.vulnerability.vulnerability ? this.vulnerability.vulnerability.name :
            this.vulnerability.cisRequirement.name, hasBackdrop: true },
      );

    });
  }
  ngOnInit(): void {

  }

  openWindowWithBackdrop() {
    this.loadVulnerability();
  }

  setGradeForVuln(number: number) {
    return this.showProjectService.setGradeForVuln(this.rowData.projectId, this.rowData.id, number).subscribe(() => {
        this.toast.showToast('primary', 'Success',
          'Vulnerability classification has been changed.');
        this.grade = number;
        this.rowData.grade = number;
        this.refresh.emit(this.rowData);
        this.loadVulnerability();
      },
      () => {
        this.toast.showToast('danger', 'Failure', 'There was a problem while changing vulnerability classification');
      });
  }
}
