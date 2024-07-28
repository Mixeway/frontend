import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbIconModule, NbInputModule, NbListModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule, NbTooltipModule, NbUserModule, NbWindowModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ExtraComponentsRoutingModule } from './extra-components-routing.module';

// components
import { ExtraComponentsComponent } from './extra-components.component';
import { SpinnerInTabsComponent } from './spinner/spinner-in-tabs/spinner-in-tabs.component';
import { SpinnerInButtonsComponent } from './spinner/spinner-in-buttons/spinner-in-buttons.component';
import { SpinnerSizesComponent } from './spinner/spinner-sizes/spinner-sizes.component';
import { SpinnerColorComponent } from './spinner/spinner-color/spinner-color.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {
  InteractiveProgressBarComponent,
} from './progress-bar/interactive-progress-bar/interactive-progress-bar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { AlertComponent } from './alert/alert.component';
import { ChatComponent } from './chat/chat.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DayCellComponent } from './calendar/day-cell/day-cell.component';
import { CalendarKitFullCalendarShowcaseComponent } from './calendar-kit/calendar-kit.component';
import { CalendarKitMonthCellComponent } from './calendar-kit/month-cell/month-cell.component';
import {MixerProgresComponent} from './mixer-progres/mixer-progres.component';
import { ConfigureInfraComponent } from './configure-infra/configure-infra.component';
import {ConfigureWebComponent} from './configure-web/configure-web.component';
import {ConfigureCodeComponent} from './configure-code/configure-code.component';
import {CiresultColorComponent} from './ciresult-color.component';
import {BugComponent} from './bug-component';
import {ReactiveFormsModule} from '@angular/forms';
import {CodeScanIntegrationIconComponent} from './code-scan-integration-icon.component';
import {OsScanIntegrationIconComponent} from './os-scan-integration-icon.component';
import { StatusAlertComponent } from './status-alert/status-alert.component';
import { CiOperationsComponent } from './ci-operations/ci-operations.component';
import { CiOperationsListElementComponent } from './ci-operations-list-element/ci-operations-list-element.component';
import {VulnmanageColorComponent} from './vulnmanage-color.component';
import {VulnLocationComponent} from './vuln-location-component';
import {NgxEchartsModule} from 'ngx-echarts';
import {LegendChartComponent} from './legend-chart/legend-chart.component';
import {VulnTrendAnalyticsComponent} from './vuln-trend-analytics/vuln-trend-analytics.component';
import {VulnTrendStatisticsComponent} from './vuln-trend-analytics/vuln-trend-statistics/vuln-trend-statistics.component';
import {VulnTrendAnalyticsChartComponent} from './vuln-trend-analytics/vuln-trend-analytics-chart/vuln-trend-analytics-chart.component';
import {SlideOutComponent} from './slide-out/slide-out.component';
import {DetailsVulnsComponent} from './details-vulns/details-vulns.component';
import { MetricComponent } from './metric/metric.component';
import {AssetTypeComponent} from './AssetTypeComponent';
import {AssetTargetComponent} from './AssetTargetComponent';
import {AssetScopeComponent} from './AssetScopeComponent';
import {AssetVulnerabilitiesComponent} from './AssetVulnerabilityComponent';
import {LocationRendererComponent} from './LocationRendererComponent';
import { AssetNameTableComponent } from './asset-name-table/asset-name-table.component';

const COMPONENTS = [
  ExtraComponentsComponent,
  AlertComponent,
  ProgressBarComponent,
  InteractiveProgressBarComponent,
  SpinnerComponent,
  SpinnerColorComponent,
  SpinnerSizesComponent,
  SpinnerInButtonsComponent,
  SpinnerInTabsComponent,
  CalendarComponent,
  DayCellComponent,
  ChatComponent,
  CalendarKitFullCalendarShowcaseComponent,
  CalendarKitMonthCellComponent,
  MixerProgresComponent,
  ConfigureInfraComponent,
  ConfigureWebComponent,
  ConfigureCodeComponent,
  CiresultColorComponent,
  VulnmanageColorComponent,
  BugComponent,
  CodeScanIntegrationIconComponent,
  OsScanIntegrationIconComponent,
  VulnLocationComponent,
  LegendChartComponent,
  VulnTrendAnalyticsComponent,
  VulnTrendStatisticsComponent,
  VulnTrendAnalyticsChartComponent,
  SlideOutComponent,
  AssetTypeComponent,
  AssetTargetComponent,
  AssetScopeComponent,
  AssetVulnerabilitiesComponent,
  LocationRendererComponent,
];

const MODULES = [
  NbAlertModule,
  NbActionsModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarKitModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbIconModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbWindowModule,
  ThemeModule,
  ExtraComponentsRoutingModule,
];

@NgModule({
  imports: [
    ...MODULES,
    NbTooltipModule,
    ReactiveFormsModule,
    NbInputModule,
    NbListModule,
    NgxEchartsModule,
    NbUserModule,
  ],
  declarations: [
    ...COMPONENTS,
    StatusAlertComponent,
    CiOperationsComponent,
    CiOperationsListElementComponent,
    DetailsVulnsComponent,
    MetricComponent,
    AssetNameTableComponent,
  ],
  entryComponents: [
    MixerProgresComponent,
    ConfigureInfraComponent,
    ConfigureWebComponent,
    ConfigureCodeComponent,
    CiresultColorComponent,
    CodeScanIntegrationIconComponent,
    OsScanIntegrationIconComponent,
    BugComponent,
  ],
    exports: [
        MixerProgresComponent,
        ConfigureInfraComponent,
        ConfigureWebComponent,
        CiresultColorComponent,
        BugComponent,
        StatusAlertComponent,
        CiOperationsComponent,
        VulnTrendAnalyticsComponent,
        DetailsVulnsComponent,
        SlideOutComponent,
        MetricComponent,
    ],
})
export class ExtraComponentsModule { }
