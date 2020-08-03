import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Category } from 'src/app/shared/item/category/category';
import { CategoryService } from 'src/app/shared/item/category/category.service';
import { AuthService } from '../../auth/auth.service';
import { SearchService } from './../../../search/service/search.service';

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
    private searchService: SearchService,
    private router: Router) {

    this.categoryService = new CategoryService();
    this.searchForm = this.formBuilder.group({
      search: ''
    });
  }

  ngOnInit() {

    // Pour reprendre le dernier compte connecté
    //this.authService.authStateChanged();

    this.getCategoriesFromService();
  }


  getCategoriesFromService() {

    console.log('getCategoriesFromService ItemCategoryFormComponent');

    this.categorySubscription = this.categoryService.categoriesSubject
      .subscribe(
        (data: Category[]) => {
          this.categories = data;
        },
        (err: string) => console.error('Observer got an error: ' + err),
        () => {
          console.log('Observer got a complete notification');
        }
      );

    this.categoryService.getCategoriesFromDB();
  }

  goToHome() {
    if (this.authService.isAuth) this.router.navigate([RouteUrl.FEED]);
    else this.router.navigate([RouteUrl.HOME]);
  }

  onSearch(searchData) {

    if (searchData['search']) {
      console.log(searchData['search']);

      this.router.navigate([RouteUrl.RESULTS], { queryParams: { q: searchData['search'],
                                                                category: 'Tout'} });
    }
  }

  onSearchByCategory(category: Category) {

    if (category) {

      console.log('onSearchByCategory', category);

      this.router.navigate([RouteUrl.RESULTS], { queryParams: { category: category.name } });
    }
  }

  goToAuthUserPage() {
    this.router.navigate([RouteUrl.USER, this.authService.authUser.id]);
  }

  goToShoppingCart() {
    this.router.navigate([RouteUrl.CART]);
  }

  newCourse() {
    this.router.navigate([RouteUrl.NEW_COURSE]);
  }

  newEvent() {
    this.router.navigate([RouteUrl.NEW_EVENT]);
  }

  goToAdmin() {
    this.router.navigate([RouteUrl.ADMIN]);
  }

  CollapseNavCategories() {
    if (this.navCategoriesCollapsed === true) this.navCategoriesCollapsed = false;
    else this.navCategoriesCollapsed = true;
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
