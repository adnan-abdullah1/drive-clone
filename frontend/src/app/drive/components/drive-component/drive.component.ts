import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger !: MatMenuTrigger;
  constructor() { }

  ngOnInit(): void {
  }
  handleMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      // Left mouse button clicked
      this.handleLeftClick();
    }
  }

  handleLeftClick(): void {
    // Your logic for left mouse button click here
    console.log('Left Mouse Button Click Function Called');
    alert('left click')
  }

  handleRightClick(event: MouseEvent): void {
    // Prevent the default context menu from showing up
    this.trigger.openMenu();
    event.preventDefault();

    // Your logic for right-click here
    console.log('Right Click Function Called');
  }


}
