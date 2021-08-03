import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-booster',
  templateUrl: './icon-booster.component.html',
  styleUrls: ['./icon-booster.component.scss']
})
export class IconBoosterComponent implements OnInit {

  @Input() isBooster: boolean;

  constructor() { }

  ngOnInit() {
  }

}
