import { CategoryService } from './services/category.service';
import { ItemFormService } from './items/item-form.service';
import { ItemCompleteFormComponent } from './items/item-complete-form/item-complete-form.component';
import { ItemMediaFormComponent } from './items/item-media-form/item-media-form.component';
import { ItemPriceFormComponent } from './items/item-price-form/item-price-form.component';
import { ItemCategoryFormComponent } from './items/item-category-form/item-category-form.component';
import { ItemTitleFormComponent } from './items/item-title-form/item-title-form.component';
import { AuthGuardService } from 'src/app/auth/services/auth-guard.service';
import { AuthentificationComponent } from './auth/authentification/authentification.component';
import { ItemFormComponent } from './items/item-form/item-form.component';
import { SingleItemComponent } from './items/single-item/single-item.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
import { UsersService } from './services/users.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found/page-not-found.component';
import { FeedComponent } from './feed/feed/feed.component';
import { HomeComponent } from './home/home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './components/search/sidebar/sidebar.component';
import { SearchComponent } from './components/search/search/search.component';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { ItemsService } from './services/items.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';

import { Ng2ImgMaxModule } from 'ng2-img-max';


const appRoutes: Routes = [
  {path:'ad', component:AdminComponent},

  {path:'home', component:HomeComponent},
  {path:'auth', component: AuthentificationComponent, children: [
    {path: '', component:SignupComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'signin', component:SigninComponent}
  ]},
  {path:'feed', canActivate:[AuthGuardService], component:FeedComponent},
  {path:'items', component:SearchComponent},
  {path:'items/item/:id', component:SingleItemComponent },

  {path:'new', canActivate:[AuthGuardService], component:ItemFormComponent, children: [
    {path: 'title', canActivate:[AuthGuardService], component:ItemTitleFormComponent},
    {path: 'category', canActivate:[AuthGuardService], component:ItemCategoryFormComponent},
    {path: 'price', canActivate:[AuthGuardService], component:ItemPriceFormComponent},
    {path: 'media', canActivate:[AuthGuardService], component:ItemMediaFormComponent},
    {path: 'complete', canActivate:[AuthGuardService], component:ItemCompleteFormComponent},
    {path: '', redirectTo:'title', pathMatch:'full'},
  ]},
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'**', component:PageNotFoundComponent}
  ]

@NgModule({
   declarations: [
      AppComponent,
      AdminComponent,
      ItemsListComponent,
      SingleItemComponent,
      ItemFormComponent,
      ItemTitleFormComponent,
      ItemCategoryFormComponent,
      ItemPriceFormComponent,
      ItemMediaFormComponent,
      ItemCompleteFormComponent,
      HeaderComponent,
      FooterComponent,
      SearchComponent,
      SidebarComponent,
      SignupComponent,
      SigninComponent,
      AuthentificationComponent,
      HomeComponent,
      AdminComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      Ng2ImgMaxModule
   ],
   providers: [
      ItemsService,
      ItemFormService,
      UsersService,
      AuthService,
      AuthGuardService,
      CategoryService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
