import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../shared/item/item.service';
import { AuthService } from '../core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../shared/item/item';
import { RouteUrl } from '../core/router/route-url.enum';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.css']
})
export class SingleItemComponent implements OnInit {

  item:Item = null;
  mainAuthorItems:Item[];
  hasItem:boolean = true;
  closeResult: string;
  moreSkillsShowed:boolean = false;

  constructor(protected itemService:ItemService,
              protected authService:AuthService,
              protected router:Router,
              protected modalService: NgbModal) { }

  ngOnInit() {
  }

  userIsAuthor(){
    if(this.authService.isAuth){

      if(this.item && this.item.authors){
        this.item.authors.forEach((author)=>{

          if(author.id === this.authService.authUser.id){
              return true;
          }
        });
      }
    }
    return false;
  }

  getMainAuthor() {
    if(this.item && this.item.authors)
    {
      return this.item.authors[0];
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
