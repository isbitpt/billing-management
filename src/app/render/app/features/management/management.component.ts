import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'isbit-home',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('ManagementComponent INIT');
  }

  public handlerCreateNewDatabase(): void{
    alert('Create new database');
  }

  public handlerSelectDatabase(): void{
    alert('handlerSelectDatabase is clicked');
  }
}
