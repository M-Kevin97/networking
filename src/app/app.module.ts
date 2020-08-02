import { FeedModule } from './feed/feed.module';
import { ItemListComponent } from './shared/components/item-list/item-list.component';
import { SingleItemModule } from './single-item/single-item.module';

import { AppRoutingRoutes } from './app-routing.routing';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { ItemFormModule } from './item-form/item-form.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
   declarations: [
      AppComponent,
      AdminComponent,
      HomeComponent,
   ],
   imports: [
      SharedModule,
      CoreModule,
      BrowserAnimationsModule,
      AppRoutingRoutes,
      AuthModule,
      SearchModule,
      ItemFormModule,
      SingleItemModule,
      FeedModule,
   ],
   providers: [
      
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
