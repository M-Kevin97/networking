import { AdminModule } from './admin/admin.module';
import { NgModule } from '@angular/core';
import * as firebase from 'firebase';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingRoutes } from './app-routing.routing';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { FeedModule } from './feed/feed.module';
import { HomeComponent } from './home/home.component';
import { ItemFormModule } from './item-form/item-form.module';
import { SearchModule } from './search/search.module';
import { SharedModule } from './shared/shared.module';
import { SingleItemModule } from './single-item/single-item.module';

// Web app's Firebase configuration
var firebaseConfig = {
   apiKey: "AIzaSyDkDnIA6BAD2rW8NVBDXtSaA87OUDBUl7s",
   authDomain: "network-55b29.firebaseapp.com",
   databaseURL: "https://network-55b29.firebaseio.com",
   projectId: "network-55b29",
   storageBucket: "network-55b29.appspot.com",
   messagingSenderId: "156096192940",
   appId: "1:156096192940:web:aa59dea901f2da043c5a09"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
   ],
   imports: [
      SharedModule,
      CoreModule,
      AppRoutingRoutes,
      AuthModule,
      AdminModule,
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
