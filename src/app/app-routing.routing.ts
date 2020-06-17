import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'**', component:HomeComponent}
];

export const AppRoutingRoutes = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
