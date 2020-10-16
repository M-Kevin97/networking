import { DatePipe } from '@angular/common';
import { View } from './../shared/model/item/click';
import { auth } from 'firebase';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteUrl } from '../core/router/route-url.enum';
import { ItemService } from '../shared/service/item/item.service';
import { Item } from '../shared/model/item/item';
import { User } from '../shared/model/user/user';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.css']
})
export class SingleItemComponent implements OnInit, AfterViewInit{

  item:Item = null;
  mainAuthorItems:Item[];
  hasItem:boolean = true;
  closeResult: string;
  moreSkillsShowed:boolean = false;
  isAuth:boolean = false;

  constructor(protected itemService:ItemService,
              protected authService:AuthService,
              protected router:Router,
              protected modalService: NgbModal,
              protected datePipe:DatePipe) { }

  ngOnInit() {}

  ngAfterViewInit(){
    console.error('SingleItemComponent AfterViewInit');
  }

  saveView() {

    let view:View =  {
      date: this.datePipe.transform(Date.now().toString(), 'dd/MM/yyyy'),
      heure: this.datePipe.transform(Date.now().toString(), 'h:mm:ss'),
      user: this.authService.isAuth ? this.authService.authUser:new User('unknown', null, null, null, null, null, null, null, null, null, null, null, null),
    };

    console.error('saveView', view);

    this.itemService.addItemClick(this.item.id, view, 
      (val)=>{

      });
  }

  isAuthor(){

    if(this.authService && this.authService.isAuth) {

      let authId = this.authService.authUser.id;

      function isAuthor(element, indice, array) {
        return (element.id === authId);
      }
  
      if(this.authService.isAuth){
        if(this.item && this.item.iAuthors && this.authService.authUser){
          this.isAuth = this.item.iAuthors.some(isAuthor);
          return this.isAuth;
        }
      }
      return false;
    }
  }

  getMainAuthor() {
    if(this.item && this.item.iAuthors)
    {
      return this.item.iAuthors[0];
    }
  }

  goToUserPage(){
    console.log('CardAuthorComponent', this.getMainAuthor().id);
    this.router.navigate([RouteUrl.USER, this.getMainAuthor().id]);
  }

  onBack(){
    this.router.navigate(['/items']);
  }

}
