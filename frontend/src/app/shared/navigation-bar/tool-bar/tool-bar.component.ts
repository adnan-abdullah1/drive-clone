import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { DialogComponent } from 'src/app/drive/components/dialog/dialog.component';
import { DriveService } from 'src/app/drive/service/drive.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  isUserLoggedIn$:BehaviorSubject<boolean>;
  showNavBar:boolean=true;
  email:string='';
  folderId:string='';
  constructor(private authService : AuthService,private ac:ActivatedRoute,
    private router:Router,
    private dialog: MatDialog,
    private driveService: DriveService) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn();
    this.isUserLoggedIn$.subscribe(
      {
        next:(val:any)=>this.showNavBar=val
      }
    )
    this.authService.getEmailSubject().subscribe({
      next:(value:string)=>{
        this.email=value
      }
    });

   }

  ngOnInit(): void {
  }

  openCreateFolderDialog(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {usage: 'createFolder', folderId:localStorage.getItem('folderId')},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.driveService.dialogData();
    });


  }

}
