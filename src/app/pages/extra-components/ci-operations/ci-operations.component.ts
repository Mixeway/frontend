import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {CiOperations} from '../../../@core/Model/CiOperations';
import {NbDialogService, NbThemeService} from '@nebular/theme';
import {delay} from 'rxjs/operators';

declare const echarts: any;

@Component({
  selector: 'ngx-ci-operations',
  templateUrl: './ci-operations.component.html',
  styleUrls: ['./ci-operations.component.scss'],
})
export class CiOperationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  ciOperations: CiOperations[];
  @ViewChild('ciOperations')
  showVulnAuditorDialog: TemplateRef<any>;
  private value = 0;
  @Input('chartValue')
  set chartValue(value: number) {
    this.value = value;

    if (this.option.series) {
      this.option.series[0].data[0].value = value;
      this.option.series[0].data[1].value = 100 - value;
      this.option.series[1].data[0].value = value;
    }
  }
  successDeployment: number;
  allDeployments: number;
  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService, private dialogService: NbDialogService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.allDeployments = this.ciOperations?.length;
    this.successDeployment = this.ciOperations?.filter((operation) => operation.result === 'Ok').length;
    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {

      const solarTheme: any = config.variables.solar;

      this.option = Object.assign({}, {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this.value,
                name: ' ',
                label: {
                  normal: {
                    position: 'center',
                    formatter: '{d}%',
                    textStyle: {
                      fontSize: '22',
                      fontFamily: config.variables.fontSecondary,
                      fontWeight: '600',
                      color: config.variables.fgHeading,
                    },
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: 100 - this.value,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'inner',
                  },
                },
                itemStyle: {
                  normal: {
                    color: solarTheme.secondSeriesFill,
                  },
                },
              },
            ],
          },
          {
            name: ' ',
            clockWise: true,
            hoverAnimation: false,
            type: 'pie',
            center: ['45%', '50%'],
            radius: solarTheme.radius,
            data: [
              {
                value: this.value,
                name: ' ',
                label: {
                  normal: {
                    position: 'inner',
                    show: false,
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: solarTheme.gradientLeft,
                      },
                      {
                        offset: 1,
                        color: solarTheme.gradientRight,
                      },
                    ]),
                    shadowColor: solarTheme.shadowColor,
                    shadowBlur: 7,
                  },
                },
                hoverAnimation: false,
              },
              {
                value: 28,
                name: ' ',
                tooltip: {
                  show: false,
                },
                label: {
                  normal: {
                    position: 'inner',
                  },
                },
                itemStyle: {
                  normal: {
                    color: 'none',
                  },
                },
              },
            ],
          },
        ],
      });
    });
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  showCIOperatonsDetails() {
    this.openCreateApiDialog(this.showVulnAuditorDialog);
  }
  openCreateApiDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      { context: this.ciOperations });
  }
}
