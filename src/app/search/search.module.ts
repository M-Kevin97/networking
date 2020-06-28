import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SearchComponent,
    SidebarComponent,
    ItemsListComponent,
  ]
})
export class SearchModule { }
