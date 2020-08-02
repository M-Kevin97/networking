import { SearchModule } from './../search/search.module';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    SharedModule,
    SearchModule
  ],
  declarations: [
    FeedComponent,
    SidebarUserComponent
  ]
})
export class FeedModule { }
