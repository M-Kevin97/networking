import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ItemResult } from 'src/app/shared/model/ISearchQuery';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { IUser } from 'src/app/shared/model/user/user';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnChanges {

  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  @Input() activeTab = ItemResult.COURSES;

  @Input() coursesList:Array<Course> = [];
  @Input() eventsList:Array<EventItem> = [];
  @Input() usersList:Array<IUser> = [];

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.warn('ngOnChanges :',changes);
  }
  
  displayPanel(activeTab){
    this.activeTab = activeTab;
  }

  getPanelName() {
    return ItemResult;
  }
}
