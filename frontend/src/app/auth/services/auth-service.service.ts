import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { loginInterface, registerInterface } from 'src/app/types/types';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private getEmail: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('email') || '');
  constructor(private http: HttpClient) { }
  register(registrationForm: registerInterface) {
    return this.http.post(`${this.apiUrl}auth/register`, registrationForm)
  }
  login(loginForm: any) {
    return this.http.post(`${this.apiUrl}auth/login`, loginForm)
  }
  isLoggedIn(): BehaviorSubject<boolean> {
    return this.isUserLoggedIn;
  }
  getEmailSubject():BehaviorSubject<string>{
    return this.getEmail;
  }
  getUserList(){
    return this.http.get(`${this.apiUrl}auth/users`)
  }

}
