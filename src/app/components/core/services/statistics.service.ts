import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private baseUrl = 'http://localhost:8080/api/statistics'; // Adjust backend URL if needed

  constructor(private http: HttpClient) { }

  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-revenue`);
  }

  getTotalOrdersCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-orders`);
  }

  getTotalProductsSold(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-products-sold`);
  }

  getTopSellingProducts(): Observable<{ productName: string, totalSold: number }[]> {
    return this.http.get<{ productName: string, totalSold: number }[]>(`${this.baseUrl}/top-selling-products`);
  }

  getRevenueByCategory(): Observable<{ categoryName: string, revenue: number }[]> {
    return this.http.get<{ categoryName: string, revenue: number }[]>(`${this.baseUrl}/revenue-by-category`);
  }

  getSalesTrend(): Observable<{ date: string, totalSales: number }[]> {
    return this.http.get<{ date: string, totalSales: number }[]>(`${this.baseUrl}/sales-trend`);
  }

  getLowStockProducts(threshold: number = 5): Observable<{ productName: string, stock: number }[]> {
    return this.http.get<{ productName: string, stock: number }[]>(`${this.baseUrl}/low-stock?threshold=${threshold}`);
  }


  getOrdersOverview(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders-overview`);
  }

}
