import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared-service/shared-service.service';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent  {
  isUserLoggedIn$ :BehaviorSubject<boolean>;
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private sharedService:SharedService,
    private authService : AuthService,
    private router : Router) {
      this.isUserLoggedIn$ = this.authService.isLoggedIn()
      this.isUserLoggedIn$.next(false);
    }
  errorMessage = 'this is required Field'
  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', Validators.required],

  }, { validator: this.passwordMatchValidator })
  get form() {
    return this.registrationForm.controls;
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true }); // Assigning error
    } else {
      confirmPasswordControl?.setErrors(null); // Clearing error
    }
  }
  register(){
    this.authService.register(this.registrationForm.value).subscribe(
      {
       next:(value)=>{
        this.toastr.success('User Registered');
        this.router.navigate(['/login']);
       },
       error:(err)=>{
        this.toastr.error(err.error.message)
       },
       complete:()=>{}
      }
    )
  }
}
