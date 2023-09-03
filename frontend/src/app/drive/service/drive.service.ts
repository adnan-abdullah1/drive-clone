import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class DriveService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }
  getFolder(userId:string,isParent:boolean=false){
    return this.http.get(`${this.apiUrl}drive/folder/${userId}?isParentFolder=${isParent}`)
  }
}
