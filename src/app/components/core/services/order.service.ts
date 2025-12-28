import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Order } from '../../shared/models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private orderUrl = `${environment.apiUrl}/order`;

    constructor(private http: HttpClient) {}

    getOrders(): Observable<any> {
        return this.http.get<Order[]>(this.orderUrl);
    }

    getPagedAndSortedOrder(
        pageNumber:number,
        pageSize:number,
        sortField:string,
        sortOrder:string
        ):Observable<any>{
        return this.http.get(`${environment.apiUrl}/order/paginate`,
          { params:new HttpParams()
           .set('page',pageNumber.toString()) 
           .set('size',pageSize.toString())
           .set('sortField',sortField)
           .set('sortOrder',sortOrder)
          }).pipe( 
           map(res=> res) 
          );
    }

    createOrder(formData: FormData): Observable<object> {
        return this.http.post(`${this.orderUrl}`, formData);
    }
    
    putOrder(orderId:number,formData:FormData):Observable<any>{
      return this.http.put(`${this.orderUrl}/${orderId}`,formData);
    }

}
