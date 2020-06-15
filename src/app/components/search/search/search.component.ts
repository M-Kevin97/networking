import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  showHideSideBar = false;

  constructor() { }

  ngOnInit() {
  }

  onShowSideBarChange(){
    this.showHideSideBar = !this.showHideSideBar;
  }
}
