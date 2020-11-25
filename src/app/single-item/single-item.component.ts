import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { RouterService } from './../shared/service/router/router.service';
import { SearchService } from './../shared/service/search/search.service';
import { DatePipe } from '@angular/common';
import { View } from '../shared/model/item/view';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../shared/service/item/item.service';
import { Item } from '../shared/model/item/item';
import { User } from '../shared/model/user/user';
import { Router } from '@angular/router';
import { Tag } from '../shared/model/tag/tag';
import { EDIT_PANE } from './components/edit-course/edit-item-pane';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.css']
})
export class SingleItemComponent implements OnInit, AfterViewInit, AfterViewChecked {

  item:Item = null;
  hasItem:boolean = true;
  closeResult: string;
  moreSkillsShowed:boolean = false;
  
  backLink:string = '';
  isSearchBackLink:boolean = false;

  // To know if that's the creator of this item that consult the page item now
  isAuthor:boolean = false;

  hasBeenUpdated:boolean = false;

  constructor(protected itemService:ItemService,
              protected authService:AuthService,
              protected router:Router,
              protected searchService:SearchService,
              protected routerService:RouterService,
              protected modalService: NgbModal,
              protected datePipe:DatePipe,
              protected cdRef:ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(){

    if(this.routerService.getLastPreviousUrl()) {
      this.backLink = this.routerService.getLastPreviousUrl();
      console.error(this.backLink);
      if(this.routerService.getLastPreviousUrl().includes(RouteUrl.SEARCH)) this.isSearchBackLink = true;
    }
  }

  saveView() {

    let view:View =  {
      date: this.datePipe.transform(Date.now().toString(), 'dd/MM/yyyy'),
      heure: this.datePipe.transform(Date.now().toString(), 'h:mm:ss'),
      user: this.authService.isAuth ? this.authService.authUser:new User('unknown', null, null, null, null, null, null, null, null, null, null, null, null, null),
    };

    this.itemService.addItemView(this.item.id, view, 
      (val)=>{

      });
  }

  isItemAuthor(){

    if(this.authService && this.authService.isAuth) {

      let authId = this.authService.authUser.id;

      function isAuthor(element, indice, array) {
        return (element.id === authId);
      }
  
      if(this.authService.isAuth){
        if(this.item && this.item.iAuthors && this.authService.authUser){
          this.isAuthor = this.item.iAuthors.some(isAuthor);
          return this.isAuthor;
        }
      }
      return false;
    }
  }

  goToUserPage(){

    this.router.navigate([RouteUrl.USER, this.item.getMainiAuthor().id]);
  }

  onSearchTag(tag:Tag){

    if(tag) this.searchService.search('0', tag.name);
  }

  onBack(){
    this.router.navigate(['/items']);
  }

  getEditPane() {
    return EDIT_PANE;
  }
}
