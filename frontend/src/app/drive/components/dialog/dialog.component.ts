import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriveService } from '../../service/drive.service';
import { SharedService } from 'src/app/shared-service/shared-service.service';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { map } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})


export class DialogComponent implements OnInit {
  folderName: string = '';
  usage: string = '';
  folderId: string = '';
  userList: Array<{ _id: string, email: string }> = [];
  selectedUserId: string = '';
  isParentFolder: boolean | undefined = false;
  fileData: any;
  fileUploadStatus: 'Upload' | 'Uploading' = "Upload";
  userId = localStorage.getItem('userId')!;
  bufferValue: number = 100;
  progressBarValue: number = 0;
  //rename file vars
  fileName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private driveService: DriveService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private authService: AuthService) {
    this.folderId = this.data.folderId;
  }

  ngOnInit(): void {
    this.usage = this.data.usage;
    this.isParentFolder = this.data.isParentFolder;
    if (this.usage === 'shareFile') {
      //fetch user list
      this.authService.getUserList().subscribe(
        {
          next: (res: any) => {
            this.userList = res.users;
          }
        }
      )
    }
  }
  createFolder() {
    this.driveService.crateFolder(this.folderName, this.folderId, this.isParentFolder).subscribe(
      {
        next: (res: any) => {
          if (res.error) {
            this.sharedService.error(res.message);
            return;
          }
          this.sharedService.success('Folder created');
          this.dialogRef.close();
        }
      }
    )
  }
  renameFolder() {
    this.driveService.renameFolder(this.folderName, this.folderId, this.isParentFolder).subscribe(
      {
        next: (res: any) => {
          if (res.error) {
            this.sharedService.error(res.message);
            return;
          }
          this.sharedService.success('Folder created');
          this.dialogRef.close();
        }
      }
    )
  }
  uploadFile(event: any) {
    this.fileUploadStatus = 'Uploading';

    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      this.sharedService.error('No files selected for upload.');
      return;
    }

    this.driveService.uploadFiles(event.target.files, this.folderId, this.userId)
      .pipe(
        map((event: any) => {
          if (event.type === HttpEventType.Response) {
            this.sharedService.success('File uploaded successfully');
          } else if (event.type === HttpEventType.UploadProgress) {
            this.progressBarValue = Math.round((100 * event.loaded) / event.total);
          }
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.error) {
            this.sharedService.error(res.message);
          }
        },
        error: (err: any) => {
          this.sharedService.error(err.error.message);
        },
        complete: () => {
          this.fileUploadStatus = 'Upload';
          this.dialogRef.close();
        },
      });
  }
  renameFile() {
    this.driveService.renameFile({
      fileName: this.fileName, folderId: this.folderId,
      userId: this.userId, isParentFolder: this.isParentFolder
    }).subscribe();
  }
}

