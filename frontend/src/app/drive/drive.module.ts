import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { DriveComponent } from './components/drive-component/drive.component';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    DriveComponent
  ],
  imports: [
    CommonModule,
    DriveRoutingModule,
    MatCardModule,
    MatMenuModule
  ]
})
export class DriveModule { }
