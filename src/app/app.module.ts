import { AppRoutingRoutes } from './app-routing.routing';
import { FeedComponent } from './feed/feed/feed.component';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';

import { HomeComponent } from './home/home.component';

@NgModule({
   declarations: [
      AppComponent,
      AdminComponent,
      AdminComponent,
      HomeComponent
   ],
   imports: [
      SharedModule,
      AppRoutingRoutes,
      CoreModule,
      AuthModule,
     // SearchModule,
      BrowserAnimationsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
