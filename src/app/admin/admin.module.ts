import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    
  ]
})
export class AdminModule { }
