import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { DriveComponent } from './components/drive-component/drive.component';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DriveComponent
  ],
  imports: [
    CommonModule,
    DriveRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class DriveModule { }
