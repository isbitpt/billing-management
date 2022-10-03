import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'isbit-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit(): void {
    console.log('ManagementComponent INIT');
  }

  public goBack(): void {
    this.router.navigate(['/']);
  }
}
