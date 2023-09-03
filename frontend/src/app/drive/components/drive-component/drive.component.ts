import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { DriveService } from '../../service/drive.service';
import {imgaeBase64} from './image-base-64'
@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger !: MatMenuTrigger;
  isParentFolder: boolean = false;
  userId: string = localStorage.getItem('userId')!;
  folderData: any={};
  fileExtensions:Array<string>=[];
  constructor(private ac: ActivatedRoute,
    private driveService: DriveService) {
    this.ac.queryParamMap.subscribe({
      next: (params) => {
        this.isParentFolder = !!params.get('isParentFolder');
      }
    })
  }

  ngOnInit(): void {
    this.driveService.getFolder(this.userId, this.isParentFolder).subscribe(
      {
        next: (res: any) => {
          this.folderData = res.folder;
          this.makeFileExtensionArray()

        }
      }
    )
  }
  openMenu() {
    this.trigger.openMenu();
  }
  makeFileExtensionArray(){
    this.folderData.files.forEach((element:{fileId:string,_id:string,fileName:string}) => {
      const fileExtension = element.fileName.split('').reverse().join('').split('.')[0].split('').reverse().join('');
      this.fileExtensions.push(fileExtension)
    });
    console.log(this.fileExtensions)
  }

  getImage(index:number){
    const fileExtensionType = this.fileExtensions[index];
    switch(fileExtensionType){
      case 'pdf':
        return imgaeBase64.pdf;
      case 'json':
        return imgaeBase64.json
      case 'png':
        return imgaeBase64.image
          default:
        return '..'
    }
  }
}
