import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../shared/models/Product.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = `${environment.apiUrl}/product`;
  private apiServerUrl = `${environment.apiUrl}/product_category`;

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<any> {
    return this.http.get<Product[]>(`${environment.apiUrl}/product`)
  }

  createProduct(formData:FormData): Observable<object> {  
    return this.http.post(`${this.productUrl}`, formData,{
      responseType:'arraybuffer'
    } );  
  }  

  public getProductById(id: number): Observable<any> {
    return this.http.get<Product>(`${this.productUrl}/${id}`)
  }

  public deleteProductById(id: number): Observable<any>{
    return this.http.delete(`${this.productUrl}/${id}`);
  }

  public updateProduct(id:number,formData:FormData): Observable<any>{
    return this.http.put(`${this.productUrl}/${id}`,formData);
  }

  public getProductCategories(): Observable<any>{
    return this.http.get(this.apiServerUrl).pipe();
  }

  public getphoto(id:number): Observable<ArrayBuffer>{
    return this.http.get(`${this.productUrl}`+'/img/'+`${id}`,{responseType:'arraybuffer'})
  }

  findProduct(
    pageNumber:number,
    pageSize:number,
    sortField:string,
    sortOrder:string
    ):Observable<any>{
    return this.http.get(`${environment.apiUrl}/product/paginate`,
      { params:new HttpParams()
       .set('page',pageNumber.toString()) 
       .set('size',pageSize.toString())
       .set('sortField',sortField)
       .set('sortOrder',sortOrder)
      }).pipe( 
       map(res=> res) 
      );
    }


}
