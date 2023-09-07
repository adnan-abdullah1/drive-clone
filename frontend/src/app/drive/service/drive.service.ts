import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DriveService {
  apiUrl=environment.apiUrl;
  driveDialogAdded:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) { }
  getFolder(userId:string,isParent:boolean=false){
    return this.http.get(`${this.apiUrl}drive/folder/${userId}?isParentFolder=${isParent}`)
  }
  crateFolder(folderName:string,parentFolderId:string){
    return this.http.post(`${this.apiUrl}drive/create-folder/${parentFolderId}`,{folderName:folderName})
  }
  dialogData(){
    this.driveDialogAdded.next(true);
  }


}
