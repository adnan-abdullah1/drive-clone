import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SharedService } from './shared-service/shared-service.service';
import { AuthService } from './auth/services/auth-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription:any ;
  constructor(private router : Router,private sharedService:SharedService,private authService : AuthService){
    this.subscription = this.router.events.subscribe({
      next:(event)=>{
        if(event instanceof NavigationStart){
          //do an api call to fetch user Data
          this.sharedService.getUserInfo(localStorage.getItem('userId')).subscribe({
            next:(res:any)=>{
              this.authService.getEmailSubject().next(res.userDetails.email)
              // localStorage.setItem('email',res.user.email)
            }
          });
        }
      }
    })
  }


}
