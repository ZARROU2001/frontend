import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { user } from "../../shared/models/user.model";
import { environment } from "src/environments/environment";

@Injectable({
   providedIn: 'root'
})

export class UserService {

   usersURL=`${environment.apiUrl}/user`;
   userPaginationUrl=`${environment.apiUrl}/user/paginate`;
   userUpdate=''
   constructor(private http:HttpClient){ } 
   
   getUsers():Observable<any> {
     return this.http.get<user>(this.usersURL);
   }

   updatUser(userId:number,formData:FormData): Observable<any> {
     return this.http.put(`${this.usersURL}/update/${userId}`,formData);
   }

   findUsers(
      pageIndex:number,
      pageSize:number,
      sortField:string,
      sortOrder:string
   ):Observable<any>{
      return this.http.get(this.userPaginationUrl,
      { params:new HttpParams()
         .set('page',pageIndex.toString())
         .set('size',pageSize.toString())
         .set('sortField',sortField)
         .set('sortOrder',sortOrder)
      })
   }
}
