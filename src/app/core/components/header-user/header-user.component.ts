import { Database } from 'src/app/core/database/database.enum';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { DefautCategory, ItemResult } from 'src/app/shared/model/ISearchQuery';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
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

    return false;
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

  /**
   * Don't display search bar on search/RESULT page, home page 
   */
  displaySearchBar(){
    return this.router.url.includes(RouteUrl.SEARCH.substr(1)) 
           && !this.router.url.includes(RouteUrl.RESULTS);
  }

  goHome() {
    // if (this.authService.isAuth) this.router.navigate([RouteUrl.SEARCH]);
    // else this.router.navigate([RouteUrl.HOME]);

    this.router.navigate([RouteUrl.HOME]);
  }

  goToAuthUserPage() {
    this.router.navigate([RouteUrl.USER, this.authService.authUser.id]);
  }

  onNewItem() {
    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }

  onNewCourse() {
    // this.router.navigate([RouteUrl.NEW_COURSE]);
  }

  onNewEvent() {
    // this.router.navigate([RouteUrl.NEW_EVENT]);
  }

  goToAdmin() {
    this.router.navigate([RouteUrl.ADMIN]);
  }

  isAuth() {
    return this.authService.isAuth;
  }

  onSignUp() {
    if (!this.isAuth()) this.router.navigate([RouteUrl.SIGNUP]);
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
