import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isCategoriesCollapsed = false;
  isInstructorsCollapsed = false;
  isPricesCollapsed = false;
  isRatingsCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

  onCategoriesCollapsed(){
    this.isCategoriesCollapsed = !this.isCategoriesCollapsed;
  }

  onInstructorsCollapsed(){
    this.isInstructorsCollapsed = !this.isInstructorsCollapsed;
  }

  onPricesCollapsed(){
    this.isPricesCollapsed = !this.isPricesCollapsed;
  }

  onRatingsCollapsed(){
    this.isRatingsCollapsed = !this.isRatingsCollapsed;
  }

}
