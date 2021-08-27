import { TermsModule } from './terms/terms.module';
import { AdminModule } from './admin/admin.module';
import { NgModule } from '@angular/core';
import * as firebase from 'firebase';
import { AppRoutingRoutes } from './app-routing.routing';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { FeedModule } from './feed/feed.module';
import { HomeComponent } from './landing-page/home/home.component';
import { ItemFormModule } from './item-form/item-form.module';
import { SearchModule } from './search/search.module';
import { SharedModule } from './shared/shared.module';
import { SingleItemModule } from './single-item/single-item.module';
import { CreateComponent } from './create/create.component';
import { GetstartedModule } from './getstarted/getstarted.module';

// Web app's Firebase configuration
var firebaseConfig_test = {
   apiKey: "AIzaSyDkDnIA6BAD2rW8NVBDXtSaA87OUDBUl7s",
   authDomain: "network-55b29.firebaseapp.com",
   databaseURL: "https://network-55b29.firebaseio.com",
   projectId: "network-55b29",
   storageBucket: "network-55b29.appspot.com",
   messagingSenderId: "156096192940",
   appId: "1:156096192940:web:aa59dea901f2da043c5a09"
};

var firebaseConfig_prod = {
   apiKey: "AIzaSyBocNomQepjO2RdpoAwehfIMzq-_r4M1TE",
   authDomain: "wyskill-5890c.firebaseapp.com",
   databaseURL: "https://wyskill-5890c-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "wyskill-5890c",
   storageBucket: "wyskill-5890c.appspot.com",
   messagingSenderId: "354576297771",
   appId: "1:354576297771:web:7a7ab6c96cc7da7cc19f6e",
   measurementId: "G-B7WSGZ654R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig_test);
// firebase.analytics();

@NgModule({
   declarations: [		
      AppComponent,
      HomeComponent,
      CreateComponent
   ],
   imports: [
      SharedModule,
      CoreModule,
      AuthModule,
      AdminModule,
      SearchModule,
      ItemFormModule,
      SingleItemModule,
      FeedModule,
      TermsModule,
      GetstartedModule,
      AppRoutingRoutes,
   ],
   providers: [
      
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
