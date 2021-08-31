import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetstartedComponent } from './getstarted.component';
import { GetstartedRoutes } from './getstarted.routing';

@NgModule({
  imports: [
    SharedModule,
    GetstartedRoutes
  ],
  declarations: [GetstartedComponent]
})
export class GetstartedModule { }
