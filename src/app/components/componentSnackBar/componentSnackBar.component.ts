import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-componentSnackBar',
  templateUrl: './componentSnackBar.component.html',
  styleUrls: ['./componentSnackBar.component.css']
})
export class ComponentSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
