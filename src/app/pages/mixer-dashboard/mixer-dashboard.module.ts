import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule, NbSpinnerModule,
    NbAlertModule, NbAccordionModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { MixerDashboardComponent } from './mixer-dashboard-component';
import { ChartModule } from 'angular2-chartjs';
import { ProjectTablesModule} from './project-table/project-tables.module';

import { VulnTypeChartComponent } from './dashboard-charts/vuln-type-chart-component';

import { TrendChartComponent } from './dashboard-charts/trend-chart.component';
import { ProjectTableComponent} from './project-table/project-table.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {ExtraComponentsModule} from '../extra-components/extra-components.module';
import {DashboardChartService} from './dashboard-charts/dashboard-chart.service';
import {DashboardService} from '../../@core/service/DashboardService';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        ThemeModule,
        NbCardModule,
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbTabsetModule,
        NbSelectModule,
        NbListModule,
        ChartModule,
        NbProgressBarModule,
        NgxEchartsModule,
        NgxChartsModule,
        LeafletModule,
        ProjectTablesModule,
        Ng2SmartTableModule,
        ExtraComponentsModule,
        NbSpinnerModule,
        NbAlertModule,
        NbAccordionModule,
        ReactiveFormsModule,
    ],
  declarations: [
    MixerDashboardComponent,
    TrendChartComponent,
    VulnTypeChartComponent,
    ProjectTableComponent,
  ],
  providers: [
    DashboardChartService,
    DashboardService,
  ],
})
export class MixerDashboardModule { }
