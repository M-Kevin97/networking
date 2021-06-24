import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onNewItem() {
    this.router.navigate([RouteUrl.NEW_ITEM]);
  }

  goToGForm() {
    // this.router.navigate([RouteUrl.NEW_ITEM]);
    window.location.href='https://forms.gle/XR4FmoyHuBqUcTJd9';
  }

}
