import { SearchRoutes } from './search.routing';
import { FilterComponent } from './components/filter/filter.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './search.component';
import { SearchCoursesComponent } from './pages/search-courses/search-courses.component';
import { SearchEventsComponent } from './pages/search-events/search-events.component';

@NgModule({
  imports: [
    SharedModule,
    SearchRoutes,
  ],
  declarations: [
    SearchComponent,
    SearchCoursesComponent,
    SearchEventsComponent,
    FilterComponent,
  ],
  exports: [
    FilterComponent,
  ]
})
export class SearchModule { }
