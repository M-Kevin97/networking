import { ItemsListComponent } from './../search/components/items-list/items-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CartComponent,
    ItemsListComponent
  ]
})
export class CartModule { }
