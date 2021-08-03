import { IUser } from 'src/app/shared/model/user/user';
import { UserService } from 'src/app/shared/service/user/user.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  iBoosters: IUser[] = [];

  constructor(private userService: UserService,
              private searchService: SearchService,
              private router: Router) {}


  ngOnInit() {

    this.iBoosters = [];

    // Getting the users form the 
    this.userService.getiUsersFromDB().then(
      (iUsers:IUser[]) => {
        if(iUsers!==null && iUsers!==undefined) {

          iUsers.forEach((iUser) => {

            if(!this.iBoosters.find(iBooster => iBooster.id === iUser.id)) {

              if(iUser.isBooster) {
                console.warn(iUser);
                this.iBoosters.push(iUser);
              }
            }
          });
        }
      }
    );
  }

  onSearchByTag(TagName:string) {

    if (TagName) {
      this.searchService.search('', TagName,'','');
    }
  }

  goToSearchPage() {

    this.router.navigate([RouteUrl.SEARCH]);
  }

  goToLink(url:string) {

    window.open(url, "_blank");
  }


}


