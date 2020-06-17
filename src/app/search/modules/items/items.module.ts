import { ItemRoutingRoutes } from './items-routing.routing';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    CoreModule,
    ItemRoutingRoutes
  ],
  declarations: [
    ItemsComponent
  ]
})
export class ItemsModule { }
