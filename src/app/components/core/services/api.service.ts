import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()

export class ApiService {
    URL=`${environment.apiUrl}`;

    constructor(private http:HttpClient){ } 

    getData(endpoint:string):Observable<any>{
        return this.http.get<any>(`${this.URL}/${endpoint}`); 
    }

    postData(endpoint:string,formData:FormData):Observable<any>{
        return this.http.post(`${this.URL}/${endpoint}`,formData);
    }

    updatData(endpoint:string,id:number,formData:FormData): Observable<any>{
        return this.http.put(`${this.URL}/${endpoint}/${id}`,formData);
    }
    
    deleteData(endpoint:string,id:number):Observable<any>{
       return this.http.delete(`${this.URL}/${endpoint}/${id}`);
    }
    
    listPageableSortableData(
        endpoint:string,
        pageNumber:number,
        pageSize:number,
        sortField:string,
        sortOrder:string
        ):Observable<any>{
        return this.http.get<any>(`${this.URL}/${endpoint}/paginate`,
          { params:new HttpParams()
           .set('page',pageNumber.toString()) 
           .set('size',pageSize.toString())
           .set('sortField',sortField)
           .set('sortOrder',sortOrder)
          })
          .pipe( 
           map(res=> res) 
          );
     }
}
