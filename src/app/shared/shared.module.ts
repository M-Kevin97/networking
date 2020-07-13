import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { ImageService } from './image/image.service';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ItemService } from './item/item.service';
import { UserService } from './user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    Ng2ImgMaxModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports : [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    SharedComponent
  ],
})
export class SharedModule {
  
  static forRoot(): ModuleWithProviders {
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
