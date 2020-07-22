import { User } from './../../../shared/user/user';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-card-author',
  templateUrl: './card-author.component.html',
  styleUrls: ['./card-author.component.css']
})
export class CardAuthorComponent implements OnInit {

  @Input() author:User;

  constructor(private router:Router) { }

  ngOnInit() {
    console.log('CardAuthorComponent', this.author);
  }

  goToUserPage(){
    console.log('CardAuthorComponent', this.author.id);
    this.router.navigate([RouteUrl.USER, this.author.id]);
  }

}
