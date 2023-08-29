import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private toastr: ToastrService) { }
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

}
