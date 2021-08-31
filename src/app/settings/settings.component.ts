import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouteUrl } from '../core/router/route-url.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router  : Router) { }

  ngOnInit() {
  }

  goToProfileSettings() {

    this.router.navigate([RouteUrl.SETTINGS + RouteUrl.PROFILE_SETTINGS]);
  }

}
