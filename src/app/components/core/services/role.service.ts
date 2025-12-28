import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
  
export class RoleService {
   URLRole=`${environment.apiUrl}/user`;

   constructor(private http:HttpClient){

   }

   getRole():Observable<any>{
    return this.http.get<any>(`${this.URLRole}/role`);
   }
   
   putRole(id:number,formData:FormData):Observable<any>{
    return this.http.put<any>(`${this.URLRole}/change_role/${id}`,formData);
   }
}
