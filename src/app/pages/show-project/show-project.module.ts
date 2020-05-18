import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowProjectComponent } from './show-project.component';
import { SummaryCardComponent } from './summary-card/summary-card.component';
import {
    NbAccordionModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbPopoverModule, NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTableModule,
    NbTabsetModule,
    NbTooltipModule,
    NbTreeGridModule,
} from '@nebular/theme';
import {GaugeChartComponent} from './summary-card/gauge-chart-component';
import {NgxEchartsModule} from 'ngx-echarts';
import { ConfigureTablesComponent } from './configure-tables/configure-tables.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { InfraConfigureTabComponent } from './configure-tables/infra-configure-tab/infra-configure-tab.component';
import { WebConfigureTabComponent } from './configure-tables/web-configure-tab/web-configure-tab.component';
import {
  CodeConfigureTabComponent,
} from './configure-tables/code-configure-tab/code-configure-tab.component';
import { ApiConfigureTabComponent } from './configure-tables/api-configure-tab/api-configure-tab.component';
import { ShowProjectDetailsChartComponent } from './show-project-details-chart/show-project-details-chart.component';
import {VulnTrendAreaStackComponent} from './show-project-details-chart/vuln-trend-area-stack.component';
import {VulnTrendPieComponent} from './show-project-details-chart/vuln-trend-pie.component';
import { DetailsTablesComponent} from './details-tables/details-tables.component';
import {AlertColorComponent} from '../extra-components/alert-color.component';
import {DetailsComponent} from '../extra-components/details-component';
import {DescriptionToggleComponent} from '../extra-components/description-toggle.component';
import {AuditResultColorComponent} from '../extra-components/audit-result-color.component';
import {ShowProjectService} from '../../@core/service/ShowProjectService';
import {AnalysisColorComponent} from '../extra-components/analysis-color.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExtraComponentsModule} from '../extra-components/extra-components.module';
import {VulnerabilitySourceComponent} from '../extra-components/vulnerability-source-component';
import {StatusComponent} from '../extra-components/status-component';

@NgModule({
  declarations: [
    ShowProjectComponent,
    SummaryCardComponent,
    GaugeChartComponent,
    ConfigureTablesComponent,
    InfraConfigureTabComponent,
    WebConfigureTabComponent,
    CodeConfigureTabComponent,
    ApiConfigureTabComponent,
    ShowProjectDetailsChartComponent,
    VulnTrendAreaStackComponent,
    VulnTrendPieComponent,
    DetailsTablesComponent,
    AlertColorComponent,
    DetailsComponent,
    VulnerabilitySourceComponent,
    StatusComponent,
    DescriptionToggleComponent,
    AuditResultColorComponent,
    AnalysisColorComponent,
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NgxEchartsModule,
    NbButtonModule,
    NbTableModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbInputModule,
    NbSelectModule,
    NbAlertModule,
    NbAccordionModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    NbIconModule,
    NbTooltipModule,
    NbListModule,
    ExtraComponentsModule,
    NbRadioModule,
    FormsModule,
  ],
  providers: [
    ShowProjectService,
    ReactiveFormsModule,
  ],
})
export class ShowProjectModule { }
