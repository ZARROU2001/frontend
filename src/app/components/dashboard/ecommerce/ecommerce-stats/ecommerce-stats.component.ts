import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { StatisticsService } from 'src/app/components/core/services/statistics.service';

@Component({
    selector: 'app-ecommerce-stats',
    templateUrl: './ecommerce-stats.component.html',
    styleUrls: ['./ecommerce-stats.component.scss']
})
export class EcommerceStatsComponent implements OnInit {

    totalRevenue!: number;
    totalOrders!: number;
    totalProductsSold!: number;

    constructor(
        public themeService: CustomizerSettingsService,
        private statisticsService: StatisticsService
    ) {}

    ngOnInit(): void {
        this.fetchStatistics();
      }

      fetchStatistics(): void {
        this.statisticsService.getTotalRevenue().subscribe(data => this.totalRevenue = data);
        this.statisticsService.getTotalOrdersCount().subscribe(data => this.totalOrders = data);
        this.statisticsService.getTotalProductsSold().subscribe(data => this.totalProductsSold = data);
      }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}