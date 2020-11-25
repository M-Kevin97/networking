import { ItemCardListComponent } from './components/item/item-card-list/item-card-list.component';
import { SearchBar2Component } from './components/search-bar2/search-bar2.component';
import { TagsInputComponent } from './components/tags-input/tags-input.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserSelectComponent } from './components/user-select/user-select.component';
import { CategoriesSelectComponent } from './components/categories-select/categories-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from './service/image/image.service';
import { ItemService } from './service/item/item.service';
import { UserService } from './service/user/user.service';
import { CourseListComponent } from './components/item/course-list/course-list.component';
import { EventListComponent } from './components/item/event-list/event-list.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemsCarouselComponent } from './components/item/items-carousel/items-carousel.component';
import { ItemCardComponent } from './components/item/item-card/item-card.component';
import { RatingListComponent } from './components/rating/rating-list/rating-list.component';
import { RatingComponent } from './components/rating/rating/rating.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CountdownModule,
  ],
  exports : [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CountdownModule,
    ItemListComponent,
    EventListComponent,
    CourseListComponent,
    UserListComponent,
    ItemsCarouselComponent,
    ItemCardComponent,
    RatingComponent,
    RatingListComponent,
    CategoriesSelectComponent,
    UserSelectComponent,
    SearchBarComponent,
    UserAvatarComponent,
    TagsInputComponent,
    SearchBar2Component,
    ItemCardListComponent,
  ],
  declarations: [
    SharedComponent,
    ItemListComponent,
    EventListComponent,
    CourseListComponent,
    UserListComponent,
    ItemsCarouselComponent,
    ItemCardComponent,
    RatingComponent,
    RatingListComponent,
    CategoriesSelectComponent,
    SearchBarComponent,
    UserSelectComponent,
    UserAvatarComponent,
    TagsInputComponent,
    SearchBar2Component,
    ItemCardListComponent,
  ],
})
export class SharedModule {
  
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ImageService,
        ItemService,
        UserService 
      ]
    };
  }
 }
