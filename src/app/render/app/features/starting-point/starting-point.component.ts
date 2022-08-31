import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'isbit-home',
  templateUrl: './starting-point.component.html',
  styleUrls: ['./starting-point.component.scss']
})
export class StartingPointComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('StartingPointComponent INIT');
  }

}
