import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { DriveService } from '../../service/drive.service';
import { imgaeBase64 } from './image-base-64';
import { SharedService } from 'src/app/shared-service/shared-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger !: MatMenuTrigger;
  isParentFolder: boolean = false;
  userId: string = localStorage.getItem('userId')!;
  folderData: any = {};
  fileExtensions: Array<string> = [];
  folderId:string='';
  constructor(private ac: ActivatedRoute,
    private driveService: DriveService,
    private sharedService : SharedService,
    private dialog : MatDialog,
    private router: Router) {

    this.ac.queryParamMap.subscribe({
      next: (params) => {
        if(params.get('isParentFolder') == 'false'){
          this.isParentFolder=false;
        }
        else{
          this.isParentFolder=true;
        }
        this.folderId = params.get('folderId')!;
        this.loadDriveData(this.folderId)
      }
    })
  }

  ngOnInit(): void {
    this.driveService.driveDialogAdded.subscribe({
      next: (value) => {
        if (value) {
          this.loadDriveData(this.folderId);
        }
      }
    })
    // this.loadDriveData();

  }
  loadDriveData(folderId:string | undefined = undefined,nestedFolder:string|undefined=undefined) {
    if(nestedFolder){
      this.router.navigate(['/drive'], { queryParams: { isParentFolder: 'false',folderId: folderId} })
    }
    this.driveService.getFolder(this.userId, this.isParentFolder,folderId).subscribe(
      {
        next: (res: any) => {
          this.folderData = res.folder;
          if(!res.files?.length)
            this.makeFileExtensionArray();
          if (this.isParentFolder) {
            localStorage.setItem('folderId', res.folder._id)
          }
        }
      }
    )
  }

  openOnMouseOver() {
    this.trigger.openMenu();
  }

  makeFileExtensionArray() {
    //takes filenames and extract extension from them, and push them to array
    //used to show file icon
    this.folderData?.files?.forEach((element: { fileId: string, _id: string, fileName: string }) => {
      const fileExtension = element.fileName.split('').reverse().join('').split('.')[0].split('').reverse().join('');
      this.fileExtensions.push(fileExtension)
    });
  }
  deleteFolder(folderId: string) {
    this.driveService.deleteFolder(folderId,this.isParentFolder).subscribe({
      next:(res:any)=>{
        if(res.error){
          this.sharedService.error(res.message);
          return;
        }
        this.sharedService.success(res.message);
        this.loadDriveData();
      },
      error:(err:any)=>{
        this.sharedService.error(err.error.message || err.message )
      }
    })
  }
  openDialog(folderId:string,usage:string){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {usage: usage, folderId:folderId},
      height: '240px',
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.driveService.dialogData();
    });
  }
  openFileRenameDialog(fileId:string,usage:string){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {usage: usage, fileId:fileId, isParentFolder:this.isParentFolder,
      folderId:this.folderId},
      height: '240px',
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.driveService.dialogData();
    });
  }



  getImage(index: number) {
    const fileExtensionType = this.fileExtensions[index];
    switch (fileExtensionType) {
      case 'pdf':
        return imgaeBase64.pdf;
      case 'json':
        return imgaeBase64.json
      case 'png':
        return imgaeBase64.image
      case 'mp4':
        return imgaeBase64.image;
      case 'rar':
        return imgaeBase64.zip;
      case 'zip':
        return imgaeBase64.zip;
      case 'csv':
        return imgaeBase64.csv;
      case "docx":
        console.log('docs called')
        return imgaeBase64.docx;
      case 'js':
        return imgaeBase64.js;
      default:
        return imgaeBase64.default;
    }
  }
}
