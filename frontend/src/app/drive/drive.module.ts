import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { DriveComponent } from './components/drive-component/drive.component';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { nameTruncatePipe } from './components/drive-component/nameTruncate';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
  declarations: [
    DriveComponent,
    DialogComponent,
    nameTruncatePipe
  ],
  imports: [
    CommonModule,
    DriveRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class DriveModule { }
