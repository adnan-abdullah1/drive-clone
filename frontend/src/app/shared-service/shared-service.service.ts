import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiURL = environment.apiUrl;
  constructor(private toastr: ToastrService, private http :HttpClient) { }
  toastrConfig = {
    closeButton: true,
    progressBar: true,
    includeTitleDuplicates: true
    // progressAnimation:'decreasing'
  }
  warn(message: string) {
    this.toastr.warning(message, '', this.toastrConfig);
  }
  error(message: string) {
    this.toastr.error(message);
  }
  success(message: string) {
    this.toastr.success(message);
  }
  info(message: string) {
    this.toastr.success(message);
  }
  getUserInfo(userId:string | null){
    return this.http.get(`${this.apiURL}auth/user/${userId}`)
  }
}
