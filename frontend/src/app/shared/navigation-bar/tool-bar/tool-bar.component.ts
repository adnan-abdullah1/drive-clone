import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
  isUserLoggedIn$:BehaviorSubject<boolean>;
  showNavBar:boolean=true;
  constructor(private authService : AuthService) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn();
    this.isUserLoggedIn$.subscribe(
      {
        next:(val:any)=>this.showNavBar=val
      }
    )
   }

  ngOnInit(): void {
  }

}
