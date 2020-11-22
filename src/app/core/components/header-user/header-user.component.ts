import { Database } from 'src/app/core/database/database.enum';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Category } from 'src/app/shared/model/category/category';
import { DefautCategory, ItemResult } from 'src/app/shared/model/ISearchQuery';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  collapsed = true;
  navCategoriesCollapsed = true;

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {

    this.searchForm = this.formBuilder.group({
      search: ''
    });
  }

  ngOnInit() {

    // Pour reprendre le dernier compte connecté
    //this.authService.authStateChanged();

  }

  getUser() {

    if(this.authService && this.authService.isAuth) {

      return this.authService.authUser;
    }

    return null;
  }

  getUserPpLink() {

    if(this.authService && this.authService.isAuth) {

      return this.authService.authUser.ppLink === Database.DEFAULT_PP_USER;
    }

    return null;
  }

  goToTrainingSearching() {
    this.router.navigate([RouteUrl.RESULTS], 
      { queryParams: 
        { 
          category: DefautCategory.ID,
          item: ItemResult.COURSES,
        }
      });
  }

  searchInstructors() {
    this.router.navigate([RouteUrl.RESULTS], 
      { queryParams: 
        { 
          category: DefautCategory.ID,
          item: ItemResult.USERS,
        }
      });
  }

  isActivate(){
    return this.router.url.includes(RouteUrl.HOME.substr(1)) 
           || (this.router.url.includes(RouteUrl.SEARCH.substr(1)) 
              && !this.router.url.includes(RouteUrl.RESULTS.substr(1)));
  }

  goHome() {
    if (this.authService.isAuth) this.router.navigate([RouteUrl.FEED]);
    else this.router.navigate([RouteUrl.HOME]);
  }

  goToAuthUserPage() {
    this.router.navigate([RouteUrl.USER, this.authService.authUser.id]);
  }

  goToShoppingCart() {
    this.router.navigate([RouteUrl.CART]);
  }

  onNewCourse() {
    this.router.navigate([RouteUrl.NEW_COURSE]);
  }

  onNewEvent() {
    this.router.navigate([RouteUrl.NEW_EVENT]);
  }

  goToAdmin() {
    this.router.navigate([RouteUrl.ADMIN]);
  }

  isAuth() {
    return this.authService.isAuth;
  }

  onSignIn() {
    if (!this.isAuth()) this.router.navigate([RouteUrl.LOGIN]);
  }

  onSignOut() {
    this.authService.signOutUser().then(
      (bool) => {
        if(bool) {
          /* Si utilisateur déconnecté, isAuth = false; */
          console.log(this.authService.isAuth, 'user est déconnecté');
          this.router.navigate([RouteUrl.HOME]);
        }
        else {
          console.error('la déconnexion a échoué');

        }
      }
    ).catch(
      (error) => {
        console.error(error);
         console.error('la déconnexion a échoué');
      }
    );
  }
}
