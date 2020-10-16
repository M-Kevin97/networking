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

  private categorySubscription: Subscription;
  private categoryService: CategoryService
  categories: Category[];

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {

    this.categoryService = new CategoryService();
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

  isHome(){
    return this.router.url.includes(RouteUrl.HOME.substr(1));
  }

  goToHome() {
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
    if (!this.isAuth()) this.router.navigate([RouteUrl.SIGNIN]);
  }

  onSignOut() {
    this.authService.signOutUser().then(
      () => {
        this.router.navigate([RouteUrl.SIGNIN]);

        /* Si utilisateur déconnecté, isAuth = false; */
        console.log(this.authService.isAuth, 'user est déconnecté');
      }
    );
  }
}
