import { NewElementComponent } from './pages/new-element/new-element.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutes } from './admin.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AdminComponent,
    NewElementComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutes,
  ],
  exports: [
  ]
})
export class AdminModule { }
