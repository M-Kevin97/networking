import { SearchResultsComponent } from './components/search-results/search-results.component';
import { CoreModule } from './../core/core.module';
import { SearchRoutes } from './search.routing';
import { FilterComponent } from './components/filter/filter.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    SearchRoutes,
  ],
  declarations: [
    SearchComponent,
    FilterComponent,
    SearchResultsComponent
  ],
  exports: [
    FilterComponent
  ]
})
export class SearchModule { }
