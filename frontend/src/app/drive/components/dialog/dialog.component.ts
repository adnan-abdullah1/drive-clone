import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriveService } from '../../service/drive.service';
import { SharedService } from 'src/app/shared-service/shared-service.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})


export class DialogComponent implements OnInit {
  folderName:string='';
  usage:string='';
  folderId:string='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private driveService:DriveService,
  private sharedService : SharedService,
  private dialogRef : MatDialogRef<DialogComponent>) {
    this.folderId = this.data.folderId;
   }

  ngOnInit(): void {
    this.usage=this.data.usage;
  }
  createFolder(){
    this.driveService.crateFolder(this.folderName,this.folderId).subscribe(
      {
        next:(res:any)=>{
          if(res.error){
            this.sharedService.error(res.message);
            return;
          }
          this.sharedService.success('Folder created');
          this.dialogRef.close();
        }
      }
    )
  }
}
