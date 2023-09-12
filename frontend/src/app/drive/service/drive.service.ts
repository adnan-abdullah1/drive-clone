import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DriveService {
  apiUrl=environment.apiUrl;
  driveDialogAdded:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) { }
  getFolder(userId:string,isParent:boolean=false,folderId:string | undefined=undefined){
    if(folderId){
      userId=folderId //bkz this time folder is nested we need folderId now
    }
    return this.http.get(`${this.apiUrl}drive/folder/${userId}?isParentFolder=${isParent}`)
  }
  crateFolder(folderName:string,parentFolderId:string,isParentFolder:boolean|undefined){
    return this.http.post(`${this.apiUrl}drive/create-folder/${parentFolderId}?isParentFolder=${isParentFolder}`,{folderName:folderName})
  }
  renameFolder(folderName:string,parentFolderId:string,isParentFolder:boolean|undefined){
    return this.http.put(`${this.apiUrl}drive/rename-folder/${parentFolderId}?isParentFolder=${isParentFolder}`,{folderName:folderName})
  }
  dialogData(){
    this.driveDialogAdded.next(true);
  }
  deleteFolder(folderId:string,isParentFolder:boolean|undefined){
    return this.http.delete(`${this.apiUrl}drive/delete-folder/${folderId}?isParentFolder=${isParentFolder}`)
  }
  uploadFiles(file:Array<any>,folderId:string,userId:string){
    let formData = new FormData();
    formData.append('file', file[0]);
     return this.http.post(`${this.apiUrl}drive/${folderId}/${userId}`,formData,{
      reportProgress:true,
      observe:'events'
    })
  }
  renameFile(data:{
    fileName: string, folderId: string,
    userId: string, isParentFolder: boolean |undefined
  }){
    const {fileName,folderId,userId,isParentFolder}=data;
    return this.http.put(`${this.apiUrl}drive/${folderId}/${userId}?isParentFolder=${isParentFolder}`,{fileName})
  }
}
