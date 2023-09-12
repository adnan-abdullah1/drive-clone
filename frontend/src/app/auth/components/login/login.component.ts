import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { SharedService } from 'src/app/shared-service/shared-service.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  isUserLoggedIn$ :BehaviorSubject<boolean>
  constructor(private fb :FormBuilder,
    private authService: AuthService,
    private sharedService :SharedService,
    private router:Router) {
      this.isUserLoggedIn$ = this.authService.isLoggedIn()
      this.isUserLoggedIn$.next(false);
    }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],


  })
  get form() {
    return this.loginForm.controls;
  }
  login(){
    this.authService.login(this.loginForm.value).subscribe({
      next:(res:any)=>{
        this.sharedService.success('login success');
        this.isUserLoggedIn$.next(true);
        localStorage.setItem('userId',res.user._id)
        this.authService.getEmailSubject().next(res.user.email)
        this.router.navigate(['/drive'], { queryParams: { isParentFolder: 'true',folderId: res.user._id } })
      },
      error:(err)=>{
        this.sharedService.error(err.error.message)
      }
    })
  }
}
